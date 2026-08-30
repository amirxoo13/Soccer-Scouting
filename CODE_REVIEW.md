# گزارش تحلیل کد — پلتفرم Soccer Scouting (Kavosh)

---

## ۱. خلاصه معماری و ساختار پروژه

**نوع پروژه:** پلتفرم B2C برای استعدادیابی فوتبال در آسیا — بازیکنان پروفایل می‌سازند، کارشناسان (scouts) جستجو و خرید اشتراک می‌کنند.

**Stack فنی:**
- **Frontend:** React 19 + TanStack Router (file-based routing) + TanStack Query
- **Backend:** TanStack Start (SSR server functions) + PostgreSQL (neon)
- **Auth:** Better Auth (email/password + OAuth providers اختیاری)
- **UI:** Tailwind v4 + Radix + shadcn-style components
- **Deploy target:** Vercel (edge)

**ساختار مسیرها:**

```
/               → صفحه اصلی (landing)
/login          → ورود / ثبت‌نام
/onboarding     → انتخاب نقش (player/scout)
/discover       → جستجوی بازیکنان
/players/$id    → پروفایل عمومی بازیکن
/app/           → داشبورد (auth-gated)
/app/profile    → ویرایش پروفایل بازیکن
/app/shortlist  → لیست کوتاه اسکاوت
/app/wallet     → کیف پول / پرداخت
/admin          → پنل ادمین
```

**جداول دیتابیس اصلی:**
`platform_users`, `player_profiles`, `player_videos`, `shortlists`, `shortlist_items`, `contact_requests`, `notifications`, `wallets`, `wallet_tx`, `subscriptions`, `youth_verifications`, `clubs`, `club_alerts`, `profile_reviews`, `saved_filters`

---

## الف) باگها و مشکلات منطقی

### 1. پرداخت بدون تأیید واقعی — **بحرانی**
**فایل:** `src/lib/server/billing.ts` — تابع `confirmDeposit`

تابع `confirmDeposit` مستقیماً موجودی کاربر را در دیتابیس اضافه می‌کند بدون هیچ تأیید پرداخت واقعی‌ای. هر کاربر می‌تواند با یک درخواست POST تعداد دلخواه دلار به کیف پول خود اضافه کند. هیچ webhook، signature verification یا تأیید خارجی وجود ندارد.

**پیشنهاد:** این endpoint باید فقط برای ثبت قصد پرداخت استفاده شود (pending state)؛ تأیید واقعی باید از طریق webhook اختصاصی gateway یا تأیید دستی ادمین انجام شود.

---

### 2. آدرس TRC20 قطعی‌سازی شده با الگوریتم ناامن — **بحرانی**
**فایل:** `src/lib/server/billing.ts` — تابع `trc20Address`

آدرس کریپتو از یک hash سفارشی FNV-ish ساخته می‌شود که **تضمین یکتایی واقعی ندارد** و به یک آدرس واقعی TRC20 اشاره نمی‌کند. کاربران ممکن است USDT واقعی به این آدرس بفرستند. همچنین این آدرس تغییرناپذیر است — اگر wallet row وجود داشته باشد، آدرس به‌روز نمی‌شود.

**پیشنهاد:** استفاده از wallet provider واقعی (Tron node یا gateway مانند CoinPayments) برای ایجاد آدرس واقعی.

---

### 3. save قبل از submit — منطقی **متوسط**
**فایل:** `src/routes/app.profile.tsx` — submit mutation

در `submit mutation`، ابتدا `saveMyProfile` و سپس `submitMyProfile` فراخوانی می‌شود. اگر `saveMyProfile` موفق شود ولی `submitMyProfile` شکست بخورد (مثلاً به خاطر شرط `canPublish`)، پروفایل در وضعیت "draft" باقی می‌ماند ولی toast خطا نشان می‌دهد. مشکل اصلی: اگر پروفایلی با status `approved` بود، بعد از save به `pending` تبدیل می‌شود و بعد submit هم شکست می‌خورد — پروفایل تأیید شده ناخواسته به pending برمی‌گردد.

**پیشنهاد:** ترتیب را معکوس کنید یا قبل از save، اعتبارسنجی publishability را انجام دهید.

---

### 4. مسیر `/players/$id` — parse عدد نادرست — **متوسط**
**فایل:** `src/routes/players.$id.tsx`

اگر `id` یک رشته غیر عددی باشد (مثل `abc`)، `Number("abc")` برابر `NaN` می‌شود. در `getPublicPlayer`، این مقدار به SQL ارسال می‌شود که ممکن است خطای PostgreSQL بدهد یا نتیجه‌ی نادرست برگرداند. هیچ بررسی `isNaN` انجام نمی‌شود.

**پیشنهاد:** اضافه کردن guard با `Number.isInteger(profileId)` قبل از فراخوانی API.

---

### 5. similar players — type-unsafe query — **متوسط**
**فایل:** `src/routes/players.$id.tsx`

در `similar` query، شرط `enabled` و `queryFn` به صورت ناامن به `result.data` دسترسی دارند. اگر `result.data.access === true` ولی `result.data.player` به دلیل race condition هنوز کامل نباشد، به خطای runtime منجر می‌شود.

---

### 6. shortlist — خطای loading مدیریت‌نشده — **جزئی**
**فایل:** `src/routes/app.shortlist.tsx`

Query مربوط به `listWatchlist` هیچ وضعیت error یا loading ندارد. اگر درخواست ناموفق باشد، صفحه به‌سادگی خالی می‌ماند بدون هیچ پیامی.

---

### 7. کارت پرداخت — اطلاعات ارسال نمی‌شود — **بحرانی**
**فایل:** `src/routes/app.wallet.tsx`

فرم کارت بانکی (card number, expiry, CVC, name) در state نگهداری می‌شود ولی در `confirmDeposit` هیچ‌کدام از این فیلدها به سرور ارسال نمی‌شوند — فقط `amount`, `plan`, و `channel` ارسال می‌شوند. بنابراین اطلاعات کارت جمع‌آوری می‌شود ولی هرگز استفاده نمی‌شود و تأیید واقعی وجود ندارد.

---

### 8. مدیریت خطای onboarding — **جزئی**
**فایل:** `src/routes/onboarding.tsx`

در `submit`، هیچ catch یا نمایش خطا وجود ندارد. اگر `completeOnboarding` شکست بخورد، کاربر روی صفحه خالی می‌ماند بدون هیچ feedback.

---

### 9. قوانین ثبت‌نام / ورود — منطق نادرست — **متوسط**
**فایل:** `src/routes/login.tsx`

در حالت sign-up، اگر خطا حاوی "already"/"exists" باشد، کد سعی می‌کند sign-in کند. اگر sign-in هم شکست بخورد، `setMode("in")` فراخوانی می‌شود — کاربر ممکن است به اشتباه به صفحه sign-in ریدایرکت شود حتی اگر رمز عبور غلط باشد.

---

### 10. دوباره‌خوانی `wallets` در `activatePlan` — **متوسط**
**فایل:** `src/lib/server/billing.ts`

در `activatePlan`، موجودی کاربر بررسی می‌شود ولی بین این بررسی و کم کردن مبلغ هیچ transaction یا row-level locking وجود ندارد. دو درخواست همزمان می‌توانند هر دو بررسی را پاس کنند و باقی‌مانده منفی شود.

**پیشنهاد:** کل عملیات را در یک transaction با `BEGIN/COMMIT` انجام دهید.

---

### 11. `adminScoutQueue` همه scouts را برمی‌گرداند — **جزئی**
**فایل:** `src/lib/server/admin.ts`

```sql
select * from platform_users where role = 'scout' order by created_at desc
```
فیلتری برای `scout_status = 'pending'` ندارد، پس همه scouts (شامل approved و rejected) در صف نمایش داده می‌شوند.

---

### 12. پروفایل lock در حین ویرایش — منطق نادرست — **متوسط**
**فایل:** `src/lib/server/player.ts` + `src/routes/app.profile.tsx`

Lock فقط بر اساس `status === "pending"` تعیین می‌شود ولی UI پیام مناسبی برای حالت `needs_revision` نمایش نمی‌دهد.

---

### 13. `queueClubAlerts` — ستون email ندارد — **جزئی**
**فایل:** `src/lib/server/billing.ts`

جدول `clubs` در migration ستون `email` ندارد. این تابع هرگز alert واقعی ارسال نمی‌کند.

---

### 14. `getPublicPlayer` — view counter بدون deduplication — **جزئی**
**فایل:** `src/lib/server/public.ts`

```sql
update player_profiles set views = views + 1 where id = ${id}
```
بدون هیچ deduplication یا throttle، هر بار که `useQuery` refetch می‌کند (مثلاً tab switch یا window focus) view +1 می‌شود.

---

## ب) بخشها یا صفحات ناقص

### 1. آمار لندینگ — hardcode
**فایل:** `src/lib/server/public.ts` — تابع `getLandingStats`

مقادیر آمار صفحه اصلی (`markets: 47`, `positions: 15`, `languages: 7`, `annual: 12`) کاملاً ساختگی و hardcode هستند.

---

### 2. `saved_filters` — جدول بدون endpoint
جدول `saved_filters` در migration تعریف شده ولی هیچ server function یا UI برای ذخیره/بازیابی فیلترهای search وجود ندارد. این قابلیت کاملاً ناقص است.

---

### 3. `club_alerts` — جدول بدون اجرا
جدول `club_alerts` تعریف شده و `queueClubAlerts` آن را پر می‌کند، ولی هیچ worker یا cron برای ارسال ایمیل واقعی وجود ندارد. alerts در جدول می‌مانند و هرگز ارسال نمی‌شوند.

---

### 4. `profile_reviews` — جدول بدون UI
جدول `profile_reviews` تاریخچه بازبینی‌ها را ذخیره می‌کند ولی هیچ صفحه‌ای برای نمایش آن در ادمین یا پروفایل بازیکن وجود ندارد.

---

### 5. Notifications — لینک کلیک‌ناپذیر
**فایل:** `src/routes/app.index.tsx`

notifications لیست می‌شوند ولی فیلد `n.link` هرگز استفاده نمی‌شود. هر notification یک link دارد (مثل `/app/profile`, `/players/ID`) ولی در UI کلیک‌پذیر نیست.

---

### 6. ادمین — خروجی داده (export) غایب
پنل ادمین آمار و لیست کاربران را نشان می‌دهد ولی هیچ قابلیت export (CSV، download) ندارد.

---

### 7. کیف پول — بخش PayPal ناقص
**فایل:** `src/routes/app.wallet.tsx`

برای PayPal فقط یک لوگو و یک hint نمایش داده می‌شود. هیچ redirect، OAuth flow، یا مکانیزم پرداخت PayPal پیاده‌سازی نشده است.

---

## ج) فیلدها، گزینه‌ها و دکمه‌های ناقص

### 1. فرم کارت بانکی — validation غایب
**فایل:** `src/routes/app.wallet.tsx`

- هیچ validation روی format کارت (Luhn, 16 رقم)، expiry date (MM/YY و تاریخ گذشته) یا CVC (3-4 رقم) وجود ندارد.
- دکمه "Pay Now" بدون توجه به فیلدهای خالی کارت فعال است.
- فیلد `card.name` هرگز به سرور ارسال نمی‌شود.

---

### 2. فرم youth verification — URL validation غایب
**فایل:** `src/routes/app.profile.tsx`

فیلدهای `idDoc` و `selfie` URL های خام می‌گیرند بدون هیچ validation روی format URL. کاربر می‌تواند هر متنی وارد کند.

---

### 3. فرم پروفایل — secondary positions به صورت text input
**فایل:** `src/routes/app.profile.tsx`

`secondaryPositions` یک `Input` ساده است (مثل "CF,ST,CAM") در حالی که `primaryPosition` یک Select با لیست مشخص است. کاربر ممکن است مقادیر نادرست وارد کند که با کلیدهای مورد انتظار مطابقت ندارند.

---

### 4. فرم club history — label بدون نام فیلد
**فایل:** `src/routes/app.profile.tsx`

Input های club, from, to هیچ label ندارند. کاربر نمی‌داند هر Input برای چه چیزی است.

---

### 5. دکمه "Remove" در ویدیوها غایب
**فایل:** `src/routes/app.profile.tsx`

امکان اضافه کردن ویدیو وجود دارد ولی هیچ دکمه حذف ویدیو در UI نیست.

---

### 6. دکمه "Remove" در club history غایب
**فایل:** `src/routes/app.profile.tsx`

مانند ویدیو، فقط افزودن ردیف جدید ممکن است، حذف ردیف موجود نیست.

---

### 7. label دسته‌بندی ویدیو — key اشتباه
**فایل:** `src/routes/app.profile.tsx`

برای dropdown دسته‌بندی ویدیو از key اشتباه `"discover.any"` استفاده شده به جای یک label مناسب مثل "Category".

---

### 8. ادمین — note textarea مشترک برای همه review ها
**فایل:** `src/routes/admin.tsx`

یک textarea برای `note` بین همه profile review ها به اشتراک گذاشته می‌شود. اگر ادمین یک note بنویسد و بعد روی دکمه approve/reject پروفایل دیگری کلیک کند، همان note به آن پروفایل هم اعمال می‌شود.

---

### 9. contact form — در دسترس همه کاربران لاگین‌کرده
**فایل:** `src/routes/players.$id.tsx`

فرم "ارسال پیام" برای همه کاربران لاگین‌کرده نمایش داده می‌شود. اگر کاربر `player` باشد (نه scout)، `sendContact` با خطای "Scout account required" برمی‌گردد ولی UI هیچ پیامی نشان نمی‌دهد که چرا send غیرممکن است.

---

### 10. `/app/wallet` — type validation ضعیف برای `plan` search param
**فایل:** `src/routes/app.wallet.tsx`

plan `"youth"` از validation رد می‌شود. اگر URL دستی `?plan=youth` داشته باشد، `wanted` برابر `undefined` شود و دکمه subscribe نمایش داده نشود بدون هیچ پیام خطا یا راهنمایی.

---

## د) وضعیت‌های loading/error مدیریت‌نشده

| فایل | مشکل |
|------|-------|
| `src/routes/app.shortlist.tsx` | حالت `list.isError` و `list.isPending` مدیریت نشده — صفحه خالی می‌ماند |
| `src/routes/app.index.tsx` | `inbox.isError`, `sent.isError`, `notes.isError` بدون feedback |
| `src/routes/admin.tsx` | خطاهای `queue`, `scouts`, `users`, `youthQ` هیچ‌کدام error state ندارند — صفحه خالی می‌ماند |
| `src/routes/app.profile.tsx` | `access.isError` مدیریت نشده — بخش youth به‌سادگی نمایش داده نمی‌شود بدون پیام |
| `src/routes/players.$id.tsx` | `watched.isError` مدیریت نشده — دکمه shortlist می‌تواند غلط نمایش داده شود |
| `src/routes/players.$id.tsx` | `similar.isError` مدیریت نشده — بخش "بازیکنان مشابه" بی‌سروصدا ناپدید می‌شود |
| `src/routes/onboarding.tsx` | خطای `completeOnboarding` به کاربر نشان داده نمی‌شود |
| `src/routes/discover.tsx` | `results.isError` وقتی رخ می‌دهد فقط count "0 results" نشان داده می‌شود |

---

## جمع‌بندی کلی — سلامت کد و آمادگی پروژه

**نقاط قوت:**
- معماری کلی تمیز و منسجم است؛ جداسازی server functions از client code خوب انجام شده.
- سیستم دسترسی (`access/canViewTalent/canPublish`) منطق کاملی دارد.
- i18n چندزبانه (7 زبان) به درستی پیاده‌سازی شده.
- کد SQL به طور کلی از parameterized queries استفاده می‌کند (SQL injection ندارد).
- TypeScript types مستحکم و consistent هستند.

**مشکلات بحرانی برای production:**

1. **امنیت مالی:** `confirmDeposit` هر مبلغی را بدون تأیید واقعی به حساب اضافه می‌کند — این یک **حفره امنیتی حیاتی** است که پیش از production باید رفع شود.
2. **آدرس کریپتو:** آدرس‌های USDT/BTC/ETH نمایش داده می‌شوند ولی واقعی نیستند؛ کاربران ممکن است پول واقعی بفرستند.
3. **Race condition در wallet:** عملیات debit بدون transaction یا locking انجام می‌شود.
4. **Email alerts:** پیاده‌سازی ناقص (queue پر می‌شود ولی هرگز ارسال نمی‌شود).

**وضعیت کلی:** پروژه برای **demo/MVP** آماده است ولی برای **استفاده واقعی با پول واقعی** آماده نیست. مشکلات مالی و امنیتی باید اولویت رفع داشته باشند. UX gaps (validation فرم‌ها، دکمه‌های حذف، error states) برای تجربه کاربری قابل قبول باید برطرف شوند.
