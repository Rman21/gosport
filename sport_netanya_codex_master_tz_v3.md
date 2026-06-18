# MASTER ТЗ для Codex: Sport Netanya MVP → SportIL

**Версия:** 1.0 unified master spec  
**Дата:** 2026-06-18  
**География MVP:** Нетания, Израиль  
**Долгосрочная цель:** единая спортивная платформа для муниципалитетов и жителей Израиля  
**Цель документа:** дать Codex единое, цельное и непротиворечивое ТЗ для реализации продукта без потерь данных из предыдущих концепций.

---

## 0. Как использовать этот документ в Codex

Этот документ является **единственным master-источником требований** для реализации Sport Netanya MVP. Он объединяет:

1. базовое ТЗ продукта: пользователи, родители, тренеры, школы, площадки, город, платежи, бронирования;
2. модуль **SportSync Hub**: подключение внешних календарей, планировщиков, API, CSV/Excel, iCal, Google/Microsoft Calendar, webhooks, Make/Zapier, будущие native connectors;
3. платежный слой с привязкой карт и payment overlay;
4. простой UX для пользователя, тренера и площадки;
5. архитектуру, базу данных, API, роли, статусы, тесты и acceptance criteria;
6. план реализации в Codex по этапам.

### 0.1. Главная продуктовая формула

> Sport Netanya должен стать не еще одним календарем, а единым простым интерфейсом спорта Нетании: найти спорт, увидеть актуальное время, записаться, оплатить картой и прийти на тренировку.

Для партнеров формула другая:

> Не заставляем площадки и тренеров бросать свои текущие планировщики. Подключаемся к ним одной кнопкой, подтягиваем актуальность, продаем свободные слоты, принимаем оплату картой и постепенно становимся главным спортивным слоем города.

### 0.2. Non-negotiable требования

Codex должен строить систему вокруг следующих правил:

1. **Нельзя хранить raw card data**: номер карты, CVV, полный PAN не попадают в нашу базу и логи.
2. **Нельзя продавать неподтвержденный слот**: если слот не имеет достаточной актуальности, показываем заявку/информацию, а не мгновенную оплату.
3. **Нельзя допускать double booking**: защита должна быть и на уровне бизнес-логики, и на уровне базы данных.
4. **Нельзя заставлять всех мигрировать сразу**: внешний календарь/CRM может оставаться source of truth.
5. **Все внешние данные должны нормализоваться** в единый формат: `Facility → Space → Slot → Booking → Payment`.
6. **Все важные действия логируются**: админ-решения, платежные события, изменения расписаний, sync-конфликты, отмены, возвраты.
7. **UX должен быть простым**: один главный CTA на экран, понятные статусы, минимум технических терминов для обычного пользователя.

### 0.3. Единая системная схема

```txt
User / Parent App
      ↓
Search + Catalog + Map
      ↓
Availability Layer ← SportSync Hub ← External Calendars / CRMs / APIs / CSV / Webhooks
      ↓
Booking Engine ← Conflict Detector ← Confidence Score
      ↓
Payment Overlay / Card Tokenization
      ↓
Coach Portal / Facility Portal / Admin Panel / City Dashboard
```

### 0.4. Главные режимы подключения партнера

Партнер может быть подключен по одному из режимов:

| Режим | Что происходит | Для кого подходит |
|---|---|---|
| `info_only` | Только карточка и контакты | неподключенные объекты |
| `mirror` | Показываем расписание из внешнего источника | площадки с календарем, но без мгновенной брони |
| `request` | Пользователь оставляет заявку, партнер подтверждает | тренеры/секции без API write-back |
| `booking` | Мгновенная запись без оплаты или с оплатой позже | партнеры с надежным расписанием |
| `payment` | Мгновенная запись + оплата картой | главный MVP monetization mode |
| `full_os` | Партнер полностью ведет расписание у нас | новые тренеры, муниципальные объекты, небольшие клубы |

---

## 1. Продуктовая идея

Создать единое простое приложение для жителей, родителей, спортсменов, тренеров, спортивных школ, клубов и площадок Нетании.

Приложение должно:

1. Показывать все спортивные площадки, секции, тренеров и тренировки в одном интерфейсе.
2. Показывать актуальное расписание и свободные слоты там, где площадка/тренер подключены к платформе.
3. Позволять пользователям записываться на тренировки, секции и бронировать площадки.
4. Позволять клиентам привязывать банковские карты через платежного провайдера и платить картой вместо наличных.
5. Повышать посещаемость спорта за счет удобного поиска, напоминаний, листа ожидания и простых оплат.
6. Повышать загрузку площадок за счет видимости свободных часов, динамических промо и прозрачной аналитики.
7. Давать тренерам и площадкам простой личный кабинет для расписания, учеников, бронирований, оплат и посещаемости.
8. Давать администратору/муниципалитету dashboard по спросу, загрузке, районам, видам спорта, отменам и no-show.

Важно: продукт не должен быть просто каталогом. Главная ценность — актуальность расписания, запись и оплата.

---

## 2. Главный принцип MVP

В MVP есть два типа объектов:

### 2.1. Информационные объекты

Это площадки/секции/тренеры, которые есть в каталоге, но еще не подключены к онлайн-записи.

Для них показываем:

- название;
- адрес;
- район;
- тип спорта;
- фото;
- описание;
- контакты;
- статус актуальности;
- кнопку “Сообщить об ошибке”;
- кнопку “Хочу записаться / запросить доступ”.

Нельзя показывать неподтвержденные слоты как доступные к оплате.

### 2.2. Подключенные объекты

Это площадки, тренеры, клубы и спортивные школы, которые получили доступ к кабинету и сами ведут расписание либо интегрированы через API.

Для них доступны:

- live-слоты;
- онлайн-запись;
- оплата картой;
- отмены и возвраты по правилам;
- лист ожидания;
- посещаемость;
- отчеты;
- автоматические уведомления.

---

## 3. Целевая аудитория

### 3.1. Пользователь / спортсмен

Ищет спорт рядом, записывается, платит картой, получает напоминания.

### 3.2. Родитель

Управляет профилями детей, записывает детей на секции/тренировки, оплачивает картой, получает уведомления.

### 3.3. Тренер

Создает группы, индивидуальные тренировки, слоты, принимает записи и платежи, отмечает посещаемость.

### 3.4. Спортивная школа / клуб

Управляет несколькими тренерами, группами, программами, учениками и оплатами.

### 3.5. Площадка / спортцентр

Управляет объектом, конкретными полями/залами/кортами, доступными слотами, ценами, правилами отмены, загрузкой.

### 3.6. Админ платформы

Модерирует данные, подключает партнеров, проверяет статусы, управляет жалобами, видит аналитику.

### 3.7. Муниципалитет / город

Видит агрегированную аналитику: загрузка объектов, спрос по районам, популярные виды спорта, дефицит инфраструктуры.

---

## 4. Роли и права доступа

Реализовать RBAC.

### 4.1. `guest`

Может:

- смотреть каталог;
- искать объекты и тренировки;
- видеть только публичную информацию;
- начать регистрацию.

Не может:

- бронировать;
- платить;
- видеть персональные данные тренеров/учеников.

### 4.2. `user`

Может:

- создавать свой профиль;
- искать тренировки/площадки;
- бронировать;
- добавлять платежный метод;
- платить;
- отменять по правилам;
- оставлять запросы и жалобы;
- становиться в waitlist.

### 4.3. `parent`

Может все, что user, плюс:

- создавать профили детей;
- записывать ребенка;
- давать согласия;
- оплачивать тренировки ребенка;
- получать уведомления по ребенку.

### 4.4. `coach`

Может:

- редактировать свой профиль;
- создавать тренировки, группы, программы;
- управлять расписанием;
- видеть список записанных пользователей;
- отмечать посещаемость;
- принимать/отклонять заявки, если тренировка требует подтверждения;
- видеть свои платежи и отчеты.

### 4.5. `organization_admin`

Для школ/клубов.

Может:

- управлять тренерами организации;
- управлять программами и группами;
- видеть платежи и посещаемость по организации;
- создавать расписание для разных тренеров.

### 4.6. `facility_manager`

Может:

- управлять объектом;
- создавать пространства внутри объекта: поле, зал, корт, дорожка, пляжная зона;
- управлять расписанием;
- управлять ценами;
- видеть брони и загрузку;
- блокировать время под обслуживание/мероприятия.

### 4.7. `platform_admin`

Может:

- модерировать весь контент;
- подключать/отключать партнеров;
- управлять статусами верификации;
- видеть финансы и аналитику;
- решать спорные ситуации;
- управлять справочниками.

### 4.8. `city_viewer`

Может:

- видеть агрегированные dashboard-данные;
- видеть карту объектов;
- видеть проблемы объектов;
- экспортировать отчеты.

Не должен видеть лишние персональные и платежные данные.

---

## 5. Основные пользовательские сценарии

## 5.1. Сценарий пользователя: найти и записаться

1. Пользователь открывает приложение.
2. Выбирает: “для себя” или “для ребенка”.
3. Указывает спорт, возраст, район, день/время, уровень и бюджет.
4. Видит список и карту вариантов.
5. Видит карточку тренировки/площадки.
6. Выбирает слот.
7. Если карта не привязана — добавляет карту через платежного провайдера.
8. Подтверждает запись и оплату.
9. Получает push/WhatsApp/SMS/email подтверждение.
10. За день и за несколько часов получает напоминание.
11. После тренировки может получить отметку посещения и чек/квитанцию.

Acceptance criteria:

- Пользователь может найти подходящую тренировку за 3–5 кликов.
- Пользователь не может оплатить неподтвержденный слот.
- После оплаты booking получает статус `confirmed`.
- После оплаты создается `PaymentTransaction`.
- У пользователя не хранится номер карты в базе приложения; хранится только токен платежного провайдера.

---

## 5.2. Сценарий родителя

1. Родитель регистрируется.
2. Создает профиль ребенка: имя, возраст, пол optional, район, интересы, уровень.
3. Добавляет платежный метод.
4. Ищет секции по возрасту и времени.
5. Записывает ребенка на пробную или регулярную тренировку.
6. Получает уведомления.
7. Видит календарь всех детей.

Acceptance criteria:

- Несовершеннолетний профиль должен быть связан с родительским аккаунтом.
- Платежи по детским профилям выполняются только с родительского платежного метода.
- Прямой открытый чат взрослый↔ребенок не входит в MVP.

---

## 5.3. Сценарий тренера: подключение

1. Тренер открывает форму “Подключить тренера”.
2. Заполняет:
   - имя;
   - телефон;
   - email;
   - виды спорта;
   - районы;
   - языки;
   - опыт;
   - возрастные группы;
   - индивидуальные/групповые тренировки;
   - цены;
   - фото;
   - документы/сертификаты optional;
   - реквизиты для выплат или платежный аккаунт.
3. Админ проверяет заявку.
4. После одобрения тренер получает доступ в кабинет.
5. Тренер создает тренировки и расписание.
6. Тренер может принимать оплату картой через платформу/провайдера.

Acceptance criteria:

- Новый тренер сначала получает статус `pending_verification`.
- Публичная публикация доступна только после статуса `verified` или `approved_basic`.
- Тренер может создать группу и расписание без помощи программиста.
- Тренер может видеть список учеников и оплат.

---

## 5.4. Сценарий спортивной площадки: подключение

1. Менеджер площадки открывает форму “Подключить площадку”.
2. Заполняет:
   - название объекта;
   - адрес;
   - координаты;
   - район;
   - типы спорта;
   - описание;
   - фото;
   - правила доступа;
   - часы работы;
   - контакты;
   - юридическое лицо/бизнес optional;
   - платежные реквизиты;
   - правила отмены;
   - удобства: свет, душ, парковка, доступность, раздевалки.
3. Создает конкретные пространства:
   - футбольное поле 1;
   - футбольное поле 2;
   - баскетбольный зал;
   - теннисный корт;
   - падел-корт;
   - школьный спортзал и т.д.
4. Для каждого пространства задает расписание и цены.
5. Админ проверяет данные.
6. После подтверждения площадка становится bookable.

Acceptance criteria:

- У одного объекта может быть много `spaces`.
- Бронируется не сам объект, а конкретное пространство и конкретный слот.
- Менеджер может блокировать время под ремонт, школу, мероприятие, турнир.
- Пользователь видит только доступные и подтвержденные слоты.

---

## 6. Статусы актуальности данных

У каждого объекта, тренера, программы и слота должен быть статус достоверности.

### 6.1. Facility status

- `draft` — создано, не видно публично.
- `pending_verification` — ожидает проверки.
- `info_only` — справочная карточка, онлайн-записи нет.
- `verified` — данные проверены.
- `bookable` — доступна онлайн-запись.
- `temporarily_closed` — временно закрыто.
- `archived` — неактуально.

### 6.2. Slot status

- `available` — можно бронировать.
- `reserved` — временно удерживается во время checkout.
- `booked` — забронировано.
- `cancelled` — отменено.
- `blocked` — закрыто менеджером.
- `maintenance` — ремонт/обслуживание.
- `unverified` — нельзя оплатить, только показать как информацию.

### 6.3. Verification fields

У сущностей добавить:

- `data_source` — coach / facility / municipality / manual_import / user_report / API;
- `last_verified_at`;
- `verified_by`;
- `confidence_score` от 0 до 100;
- `verification_notes`.

---

## 7. Платежи и привязка карт

## 7.1. Главная бизнес-цель платежей

Перевести тренировки и бронирования из наличных в прозрачные card payments:

- пользователям проще платить;
- тренерам проще получать деньги;
- площадкам проще закрывать свободные часы;
- меньше no-show;
- можно вводить отмены, штрафы, предоплату, абонементы;
- появляется финансовая аналитика.

## 7.2. Критическое правило безопасности

Приложение не хранит номера карт, CVV и полный PAN.

Приложение хранит только:

- `payment_provider`;
- `provider_customer_id`;
- `provider_payment_method_token`;
- последние 4 цифры карты, если провайдер возвращает;
- бренд карты;
- срок действия masked/metadata, если разрешено;
- статус метода оплаты.

Добавление карты должно проходить через hosted checkout / iframe / redirect платежного провайдера, чтобы минимизировать PCI scope.

Ссылки для проверки:

- PCI DSS: https://www.pcisecuritystandards.org/standards/
- Tranzila: https://www.tranzila.com/english.html
- Grow/Meshulam: https://grow.business/
- Allpay explanation of PSP/acquirer roles in Israel: https://allpay.co.il/en/help/difference-between-allpay-and-acquirer
- Privacy Protection Authority Israel: https://www.gov.il/en/departments/the_privacy_protection_authority

## 7.3. Провайдеры для изучения

Для Израиля изучить интеграции:

- Tranzila;
- Cardcom;
- Grow / Meshulam;
- PayPlus;
- Allpay;
- Isracard / CAL integration through PSP/acquirer setup;
- invoices: Green Invoice / Morning / provider invoice module.

В MVP реализовать `PaymentProviderAdapter` и один рабочий mock provider. Реальную интеграцию подключить через adapter без переписывания бизнес-логики.

## 7.4. Модели платежей

### Модель A: marketplace orchestrator

Платформа собирает платеж и потом делает payout тренеру/площадке.

Плюсы:

- лучший UX;
- единая оплата;
- легче брать комиссию.

Минусы:

- сложнее юридически и бухгалтерски;
- может потребовать отдельной схемы договоров, payouts, налоговых документов.

### Модель B: direct merchant

Тренер/площадка имеет свой merchant/payment account. Платформа отправляет оплату туда, а комиссию получает отдельно.

Плюсы:

- проще объяснить партнерам;
- меньше риска удержания чужих средств.

Минусы:

- сложнее onboarding;
- сложнее единая аналитика и возвраты.

### Рекомендация MVP

Начать с гибридной архитектуры:

- в коде поддержать обе модели;
- в MVP можно использовать один platform merchant account для пилота с юридической проверкой;
- для масштабирования предусмотреть provider sub-accounts или direct merchant accounts.

## 7.5. Payment flows

### Add card

1. User clicks “Add card”.
2. Backend creates setup session with provider.
3. User enters card on provider page/iframe.
4. Provider returns token via redirect/webhook.
5. Backend stores token metadata.
6. Payment method appears in profile.

### One-time booking payment

1. User selects slot.
2. Backend creates temporary reservation for 10 minutes.
3. User confirms payment.
4. Backend charges card through provider token/checkout.
5. Provider sends webhook `payment_succeeded`.
6. Booking becomes `confirmed`.
7. Receipt/invoice is generated.
8. Notifications are sent.

### Trial training

Possible modes:

- free trial;
- paid trial;
- card required but charge later;
- deposit only.

### Monthly group subscription

1. Parent/user enrolls in program.
2. User approves recurring payment terms.
3. Platform stores subscription/payment authorization token.
4. Monthly charge runs automatically.
5. Failed payment triggers retry + notification + admin alert.

### Cancellation/refund

Cancellation policy per coach/facility:

- free cancellation until X hours before;
- partial refund;
- no refund;
- credit balance instead of refund;
- manual review.

All refund actions must be logged.

---

## 8. Product modules

## 8.1. Public catalog

Features:

- list of facilities;
- list of sports;
- list of coaches;
- list of programs/classes;
- map view;
- filters by sport, age, area, price, time, level, language, accessibility;
- facility detail page;
- coach detail page;
- training detail page.

## 8.2. Booking engine

Features:

- recurring availability rules;
- one-time slots;
- slot reservation during checkout;
- double-booking protection;
- cancellations;
- refunds;
- waitlist;
- attendance status;
- booking history.

## 8.3. Coach/School CRM light

Features:

- coach profile;
- group/program creation;
- calendar;
- students list;
- attendance;
- payment status;
- messages/announcements through notification system;
- trial requests;
- waitlist;
- reports.

## 8.4. Facility management

Features:

- facility profile;
- spaces management;
- availability schedule;
- pricing rules;
- blocked times;
- maintenance issues;
- booking list;
- revenue report;
- utilization report.

## 8.5. User/family account

Features:

- profile;
- child profiles;
- payment methods;
- bookings;
- enrollments;
- notifications;
- favorites;
- cancellations;
- receipts.

## 8.6. Admin panel

Features:

- partner onboarding;
- moderation;
- verification;
- reports;
- support tickets;
- complaints;
- payment transactions overview;
- audit logs;
- data quality dashboard.

## 8.7. City dashboard

Features:

- facility map;
- utilization by area;
- utilization by sport;
- demand by age group;
- no-show/cancellation rates;
- low-load hours;
- high-demand sports;
- reports export.

---

## 9. MVP screens

## 9.1. User app / PWA

1. Splash / language selector.
2. Onboarding: who are you? user / parent / coach / facility.
3. Home search.
4. Sports categories.
5. Map/list toggle.
6. Facility page.
7. Coach page.
8. Training/program page.
9. Slot selection.
10. Checkout.
11. Add card.
12. Booking confirmation.
13. My bookings.
14. My family.
15. Payment methods.
16. Notifications.
17. Report wrong info.

## 9.2. Coach portal

1. Dashboard.
2. Calendar.
3. My groups.
4. Create/edit training.
5. Students.
6. Attendance.
7. Payments.
8. Profile.
9. Settings/cancellation policy.

## 9.3. Facility portal

1. Dashboard.
2. Facility profile.
3. Spaces.
4. Availability.
5. Pricing.
6. Bookings.
7. Blocked time/maintenance.
8. Payments/reports.
9. Settings.

## 9.4. Admin panel

1. Overview.
2. Facilities moderation.
3. Coaches moderation.
4. Programs moderation.
5. Bookings.
6. Payments.
7. User reports.
8. Analytics.
9. Audit log.

---

## 10. Data model

Use PostgreSQL + PostGIS. Use UUID primary keys.

### Core tables

- `users`
- `user_profiles`
- `athlete_profiles`
- `family_members`
- `guardian_consents`
- `organizations`
- `organization_members`
- `coach_profiles`
- `facilities`
- `spaces`
- `sports`
- `sport_tags`
- `programs`
- `program_sessions`
- `availability_rules`
- `slots`
- `bookings`
- `enrollments`
- `waitlist_entries`
- `payment_methods`
- `payment_transactions`
- `refunds`
- `payouts`
- `invoices`
- `attendance_records`
- `notifications`
- `user_reports`
- `maintenance_issues`
- `verification_logs`
- `audit_logs`
- `support_tickets`

### Important fields

#### `facilities`

- id
- name
- description
- address
- city
- neighborhood
- lat
- lng
- contact_phone
- contact_email
- website
- status
- data_source
- last_verified_at
- confidence_score
- created_by
- manager_user_id
- amenities jsonb
- accessibility jsonb
- images jsonb
- created_at
- updated_at

#### `spaces`

- id
- facility_id
- name
- sport_id
- type
- surface
- indoor boolean
- lighting boolean
- capacity
- status
- booking_enabled boolean
- default_duration_minutes
- created_at
- updated_at

#### `coach_profiles`

- id
- user_id
- organization_id nullable
- display_name
- bio
- sports jsonb
- languages jsonb
- experience_years
- age_groups jsonb
- status
- verification_status
- payment_account_status
- cancellation_policy_id
- created_at
- updated_at

#### `programs`

- id
- coach_id nullable
- organization_id nullable
- facility_id nullable
- space_id nullable
- sport_id
- title
- description
- age_min
- age_max
- level
- price_type: free / one_time / monthly / package
- price_amount
- currency
- capacity
- status
- booking_mode: instant / request_to_join / admin_approval
- trial_available boolean
- created_at
- updated_at

#### `slots`

- id
- facility_id nullable
- space_id nullable
- coach_id nullable
- program_id nullable
- start_at
- end_at
- timezone
- capacity
- booked_count
- price_amount
- currency
- status
- verification_status
- source
- reserved_until nullable
- created_at
- updated_at

#### `bookings`

- id
- user_id
- athlete_profile_id nullable
- slot_id
- program_id nullable
- status: pending_payment / confirmed / cancelled / completed / no_show / refunded
- amount_total
- currency
- payment_transaction_id nullable
- cancellation_reason nullable
- created_at
- updated_at

#### `payment_methods`

- id
- user_id
- provider
- provider_customer_id
- provider_payment_method_token
- card_brand nullable
- card_last4 nullable
- exp_month nullable
- exp_year nullable
- status
- is_default
- created_at
- updated_at

#### `payment_transactions`

- id
- booking_id nullable
- enrollment_id nullable
- user_id
- provider
- provider_transaction_id
- amount
- currency
- status: initiated / authorized / captured / failed / refunded / partially_refunded
- failure_code nullable
- raw_provider_event_id nullable
- created_at
- updated_at

---

## 11. API requirements

Use REST or tRPC. REST suggested for clarity.

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me`

### Catalog

- `GET /sports`
- `GET /facilities`
- `GET /facilities/:id`
- `GET /coaches`
- `GET /coaches/:id`
- `GET /programs`
- `GET /programs/:id`
- `GET /slots/search`

### Bookings

- `POST /bookings/reserve`
- `POST /bookings/:id/confirm-payment`
- `POST /bookings/:id/cancel`
- `GET /bookings/my`
- `GET /bookings/:id`

### Payment methods

- `POST /payments/setup-session`
- `GET /payments/methods`
- `DELETE /payments/methods/:id`
- `POST /payments/webhooks/:provider`
- `POST /payments/refund`

### Coach portal

- `POST /coach/apply`
- `GET /coach/dashboard`
- `POST /coach/programs`
- `PATCH /coach/programs/:id`
- `POST /coach/slots`
- `PATCH /coach/slots/:id`
- `GET /coach/bookings`
- `POST /coach/attendance`

### Facility portal

- `POST /facilities/apply`
- `POST /facility/spaces`
- `PATCH /facility/spaces/:id`
- `POST /facility/availability-rules`
- `POST /facility/slots/block`
- `GET /facility/bookings`
- `GET /facility/reports/utilization`

### Admin

- `GET /admin/dashboard`
- `GET /admin/facilities/pending`
- `POST /admin/facilities/:id/approve`
- `POST /admin/facilities/:id/reject`
- `GET /admin/coaches/pending`
- `POST /admin/coaches/:id/approve`
- `GET /admin/reports`
- `GET /admin/audit-logs`

---

## 12. Booking rules

1. Do not allow double booking of the same `space_id` overlapping in time.
2. Do not allow booking of unverified slots.
3. Reserve slot temporarily during checkout.
4. Release reservation automatically if payment not completed within TTL.
5. All booking changes must be written to audit log.
6. Cancellation policy must be calculated before user confirms cancellation.
7. Waitlist must trigger notification when capacity opens.
8. If payment succeeds but booking confirmation fails, mark transaction for manual review.
9. If booking succeeds but payment fails, booking status remains `pending_payment` or expires.

---

## 13. Notifications

Channels:

- push;
- email;
- SMS optional;
- WhatsApp optional for Israel MVP.

Events:

- booking confirmed;
- payment succeeded;
- payment failed;
- booking cancelled;
- refund processed;
- upcoming training reminder 24h before;
- upcoming training reminder 2h before;
- waitlist slot available;
- coach changed schedule;
- facility blocked/cancelled slot;
- card expired/failed.

---

## 14. Analytics

### Platform analytics

- total users;
- active users;
- searches;
- search-to-booking conversion;
- bookings;
- revenue;
- GMV;
- card adoption rate;
- cash-to-card migration;
- cancellation rate;
- no-show rate.

### Facility analytics

- available hours;
- booked hours;
- utilization %;
- revenue;
- low-load hours;
- top sports;
- cancellation/no-show.

### Coach analytics

- students;
- active groups;
- attendance rate;
- payment collection rate;
- trial-to-paid conversion;
- no-show.

### City analytics

- demand by neighborhood;
- demand by age group;
- demand by sport;
- capacity shortage;
- inactive facilities;
- accessibility gaps;
- utilization heatmap.

---

## 15. Tech stack recommendation

### MVP stack

- Frontend web/PWA: Next.js + TypeScript.
- Mobile later: React Native or Flutter.
- Backend: NestJS + TypeScript.
- DB: PostgreSQL + PostGIS.
- ORM: Prisma.
- Auth: JWT + refresh tokens or managed auth.
- Queue: BullMQ + Redis.
- Storage: S3-compatible.
- Maps: Google Maps or Mapbox.
- Payments: adapter architecture with mock provider first.
- Notifications: adapter architecture.
- Deployment: Docker.

### Monorepo structure

```
/apps
  /web
  /api
/packages
  /db
  /types
  /ui
  /payments
  /notifications
  /config
```

---

## 16. Security and privacy

1. Never store raw card data.
2. Never log card numbers, CVV or sensitive provider payloads.
3. Verify payment webhook signatures.
4. Use HTTPS only.
5. Encrypt sensitive fields where needed.
6. Use RBAC for every admin/partner endpoint.
7. Add audit logs for admin actions.
8. Use parental account model for minors.
9. Do not build direct adult-child chat in MVP.
10. Provide privacy policy, terms, cancellation policy.
11. Support data deletion/export request flow in admin.

---

## 17. Codex implementation plan

### Phase 1: Skeleton

- Create monorepo.
- Add Next.js app.
- Add NestJS API.
- Add Prisma schema.
- Add PostgreSQL Docker setup.
- Add seed data for Netanya demo.
- Add auth and RBAC.

### Phase 2: Catalog

- Sports directory.
- Facilities list/map.
- Facility details.
- Coach list/details.
- Program list/details.
- Search filters.

### Phase 3: Partner portals

- Coach apply flow.
- Coach dashboard.
- Facility apply flow.
- Facility dashboard.
- Admin approval.

### Phase 4: Booking

- Slot model.
- Availability rules.
- Search slots.
- Reserve slot.
- Confirm booking.
- Cancel booking.
- Waitlist.

### Phase 5: Payments

- PaymentProvider interface.
- Mock provider.
- Add-card setup flow.
- Payment method storage.
- Booking payment.
- Payment webhook.
- Refund skeleton.
- Invoice skeleton.

### Phase 6: Notifications and analytics

- Notifications table.
- Email/push mock adapter.
- Booking reminders job.
- Facility utilization dashboard.
- Coach attendance dashboard.
- Admin dashboard.

---

## 18. PaymentProvider interface

Implement provider abstraction.

```ts
export interface PaymentProvider {
  createCustomer(input: CreateCustomerInput): Promise<CreateCustomerResult>;
  createSetupSession(input: CreateSetupSessionInput): Promise<CreateSetupSessionResult>;
  charge(input: ChargeInput): Promise<ChargeResult>;
  refund(input: RefundInput): Promise<RefundResult>;
  parseWebhook(headers: Record<string, string>, body: unknown): Promise<PaymentWebhookEvent>;
}
```

Mock provider must simulate:

- card setup success;
- payment success;
- payment failure;
- refund success;
- webhook event.

---

## 19. Must-have acceptance criteria for MVP

1. User can search sport options in Netanya by sport, age, location, time and price.
2. User can see difference between info-only and bookable objects.
3. Coach can apply, get approved, create program and slots.
4. Facility can apply, get approved, create spaces and slots.
5. User can reserve and pay for a bookable slot with a saved tokenized card.
6. System prevents double booking.
7. User receives booking confirmation.
8. Coach/facility sees booking in dashboard.
9. Admin can approve/reject coaches and facilities.
10. Admin can see utilization and revenue metrics.
11. No raw card data is stored in the app database.
12. Every important action is audit-logged.

---

## 20. Out of scope for MVP

- Native apps.
- Full government integration.
- Full accounting automation.
- Smart gate integration.
- Public ratings/reviews.
- Direct chat.
- Complex leagues/tournaments.
- AI recommendations.
- Dynamic pricing engine.
- Multi-city national rollout.

---

## 21. Development instruction for Codex

Build the MVP as production-grade architecture, but keep UI simple and clean.

Prioritize:

1. Correct data model.
2. Clear roles and permissions.
3. Reliable booking engine.
4. Payment abstraction with tokenized card model.
5. Admin moderation.
6. Simple user experience.
7. Auditability.

Do not hardcode payment provider logic into booking logic. Use adapters.

Do not store card numbers.

Do not allow booking unverified slots.

Do not allow overlapping bookings for the same space.

Add seed data for Netanya demo:

- 5 sports;
- 5 facilities;
- 10 spaces;
- 5 coaches;
- 10 programs;
- 30 slots.



---

# Дополнение v0.2: SportSync Hub — универсальный модуль синхронизации расписаний AAA+ 2026

## 22. Цель модуля

SportSync Hub — это слой интеграций, который позволяет площадкам, тренерам, клубам и спортивным школам подключиться к Sport Netanya без болезненной миграции из их текущих систем.

Главная идея: не заставлять партнера сразу бросать Boostapp, Arbox, Tazman, Google Calendar, Excel или внутренний планировщик. Нужно дать ему кнопку “Подключить расписание”, забрать данные, показать preview, сопоставить площадки/тренеров/группы, включить live-актуальность и постепенно перевести оплату и запись в нашу систему.

Цель UX:

> “Подключил календарь/систему → увидел импортированные площадки, тренеров и занятия → подтвердил маппинг → получил live-запись и оплату картой.”

## 23. Основной принцип: Bridge Mode вместо принудительной миграции

В MVP и в первых коммерческих внедрениях использовать Bridge Mode.

Bridge Mode означает:

1. Внешняя система может оставаться источником расписания.
2. Sport Netanya получает доступность и занятость через API, webhook, calendar sync, iCal, CSV/Excel или automation connector.
3. Пользователь в Sport Netanya видит актуальные слоты и может записаться.
4. После записи Sport Netanya создает booking у себя и, если разрешено интеграцией, пишет занятость обратно во внешнюю систему.
5. Если write-back невозможен, слот нельзя делать “instant confirmed”; он должен быть `request_to_book` или `pending_partner_confirmation`.

## 24. Уровни интеграции

### Level 0 — Manual / Admin Import

Для партнеров без цифровой системы.

- Админ или партнер загружает Excel/CSV.
- Система распознает площадки, тренеров, группы, расписание, цены.
- После preview партнер подтверждает импорт.
- Дальше партнер может вести расписание прямо в Sport Netanya.

Статус доступности: средний, требует регулярного подтверждения.

### Level 1 — iCal / ICS feed

Для систем, которые умеют экспортировать календарь.

- Sport Netanya читает `.ics` feed.
- События превращаются в busy blocks.
- Можно показывать занятость и свободные окна.
- Обычно это read-only режим.
- Instant booking разрешать только если свободные слоты создаются в Sport Netanya и нет конфликта с ICS busy blocks.

Статус доступности: хороший для занятости, ограниченный для записи.

### Level 2 — Google Calendar / Microsoft Calendar / CalDAV

Для тренеров, залов, школ и небольших клубов.

- OAuth-подключение календаря.
- Initial sync.
- Incremental sync.
- Webhook/push notifications, если поддерживается.
- Возможность write-back: создание busy event после брони.

Статус доступности: высокий.

### Level 3 — Automation connectors: Zapier / Make / Webhook

Для систем, у которых есть Zapier/Make/automation.

- Partner создает сценарий: “новая тренировка / изменение / отмена” → webhook в Sport Netanya.
- Sport Netanya принимает события в стандартном Partner Webhook API.
- В обратную сторону можно отправлять booking.created / booking.cancelled.

Статус доступности: высокий, если сценарии настроены правильно.

### Level 4 — Native API Connector

Для систем с API.

- BoostappConnector.
- ArboxConnector.
- TazmanConnector, если есть API/партнерский доступ.
- CustomFacilityConnector.

Статус доступности: высокий.

### Level 5 — Full Partner Integration

Для крупных муниципалитетов, сетей и будущего SportIL.

- Двусторонний API.
- Webhooks.
- Idempotency keys.
- Booking holds.
- Confirm/cancel/refund.
- Resource mapping.
- Health monitoring.

Статус доступности: максимальный.

## 25. One Button Connect: onboarding flow

### Step 1 — Partner chooses system

Экран: “Как вы сейчас ведете расписание?”

Варианты:

- Google Calendar;
- Outlook / Microsoft 365;
- Apple / iCloud / CalDAV;
- Boostapp;
- Arbox;
- Tazman;
- Excel / Google Sheets;
- Zapier / Make;
- другая система;
- пока нет системы.

### Step 2 — Authorization

В зависимости от типа:

- OAuth для Google/Microsoft;
- API key для систем с API;
- webhook URL для Make/Zapier;
- iCal URL для read-only календаря;
- upload CSV/Excel;
- manual setup.

### Step 3 — Initial import

Система импортирует:

- organization;
- facilities;
- spaces;
- coaches;
- programs/classes;
- sessions;
- busy blocks;
- prices;
- capacity;
- cancellation rules, если доступны;
- external IDs.

### Step 4 — AI-assisted mapping

Система предлагает сопоставления:

- “מגרש 1” → Football Field 1;
- “אולם כדורסל” → Basketball Hall;
- “ילדים 7-9” → age range 7-9;
- “מאמן דני” → Coach Danny;
- “Padel Court 2” → Space: Padel Court #2.

Важно: AI только предлагает. Партнер подтверждает.

### Step 5 — Preview before go-live

Показать партнеру:

- сколько объектов найдено;
- сколько пространств;
- сколько тренеров;
- сколько будущих занятий;
- какие конфликты;
- какие слоты можно продавать;
- какие данные неполные.

### Step 6 — Sync mode selection

Партнер выбирает режим:

- `read_only_visibility` — только показывать занятость/информацию;
- `request_to_book` — пользователь оставляет заявку, партнер подтверждает;
- `instant_booking_with_writeback` — мгновенная запись и запись обратно во внешнюю систему;
- `sportnetanya_source_of_truth` — партнер переходит на наш календарь;
- `payment_overlay` — расписание остается у партнера, но оплата идет через Sport Netanya.

### Step 7 — Go live

После подтверждения:

- создать mappings;
- включить sync jobs;
- включить health checks;
- показать объект/тренировки пользователям;
- включить оплату только для подтвержденных bookable slots.

## 26. Source-of-truth модели

### Model A — External system is source of truth

Подходит для Boostapp/Arbox/Tazman/Google Calendar.

- Внешняя система определяет занятость.
- Sport Netanya читает изменения.
- После брони Sport Netanya пишет событие обратно.
- Если write-back не поддерживается, instant booking запрещен.

### Model B — Sport Netanya is source of truth

Подходит для новых площадок и тренеров без сильной системы.

- Все слоты создаются у нас.
- Внешние календари получают export feed.
- Партнеры работают из нашего кабинета.

### Model C — Hybrid source of truth

Подходит для переходного периода.

- Внешний календарь дает busy blocks.
- Sport Netanya генерирует bookable slots.
- Бронь у нас блокирует слот у нас и создает busy event во внешнем календаре, если есть write-back.

## 27. Данные, которые нужно нормализовать

Внешние системы называют одно и то же по-разному. Нужна единая модель.

### External resource mapping

- `external_provider`
- `external_account_id`
- `external_resource_id`
- `external_resource_type`
- `internal_entity_type`
- `internal_entity_id`
- `mapping_confidence`
- `confirmed_by_partner`
- `confirmed_at`

### Normalized entities

- `Facility`
- `Space`
- `Coach`
- `Program`
- `ProgramSession`
- `AvailabilityRule`
- `BusyBlock`
- `Slot`
- `Booking`
- `Payment`

### Event types

- `availability_rule`
- `bookable_session`
- `busy_block`
- `external_booking`
- `maintenance_block`
- `holiday_block`
- `tournament_block`
- `school_reserved_block`

## 28. Как строить актуальность

Нельзя просто импортировать календарь и считать его правдой навсегда.

Для каждого slot/session хранить:

- `source_provider`
- `source_mode`
- `external_id`
- `last_synced_at`
- `last_confirmed_at`
- `sync_health_status`
- `confidence_score`
- `can_instant_book`
- `can_write_back`
- `requires_partner_confirmation`

### Availability Confidence Score

Рассчитать score от 0 до 100.

Примерная логика:

- +30: есть API или OAuth sync;
- +20: есть webhook/change notification;
- +15: последняя синхронизация успешна недавно;
- +15: есть write-back;
- +10: нет конфликтов;
- +10: партнер подтвердил mapping;
- -30: последняя sync job failed;
- -40: read-only ICS без свежего обновления;
- -50: обнаружен конфликт после оплаты.

Показывать пользователю не score, а простую метку:

- Green: “Подтверждено”;
- Yellow: “Требует подтверждения”;
- Gray: “Информация”;
- Red: “Недоступно”.

## 29. Connector interface для Codex

```ts
export type SyncDirection = 'read_only' | 'write_only' | 'two_way';
export type ConnectorCapability =
  | 'initial_import'
  | 'incremental_sync'
  | 'webhooks'
  | 'list_resources'
  | 'list_events'
  | 'create_booking_hold'
  | 'confirm_booking'
  | 'cancel_booking'
  | 'write_busy_block'
  | 'read_payments'
  | 'write_customer_lead';

export interface ScheduleConnector {
  provider: string;

  getCapabilities(): ConnectorCapability[];

  connect(input: ConnectInput): Promise<ConnectResult>;

  disconnect(connectionId: string): Promise<void>;

  healthCheck(connectionId: string): Promise<ConnectorHealth>;

  initialSync(input: InitialSyncInput): Promise<InitialSyncResult>;

  incrementalSync(input: IncrementalSyncInput): Promise<IncrementalSyncResult>;

  subscribeToChanges?(input: SubscribeInput): Promise<SubscribeResult>;

  handleWebhook?(input: WebhookInput): Promise<ExternalChangeEvent[]>;

  listResources(input: ListResourcesInput): Promise<ExternalResource[]>;

  listEvents(input: ListEventsInput): Promise<ExternalCalendarEvent[]>;

  createHold?(input: CreateHoldInput): Promise<CreateHoldResult>;

  confirmBooking?(input: ConfirmBookingInput): Promise<ConfirmBookingResult>;

  cancelBooking?(input: CancelBookingInput): Promise<CancelBookingResult>;

  writeBusyBlock?(input: WriteBusyBlockInput): Promise<WriteBusyBlockResult>;
}
```

## 30. Tables для Sync Hub

Добавить таблицы:

- `integration_providers`
- `external_connections`
- `external_resources`
- `external_object_mappings`
- `sync_runs`
- `sync_events`
- `sync_errors`
- `sync_webhook_events`
- `availability_snapshots`
- `busy_blocks`
- `slot_conflicts`
- `connector_health_checks`
- `partner_import_sessions`
- `partner_import_preview_items`
- `source_priority_rules`

## 31. Защита от double booking

Правила:

1. Все бронирования проходят через internal booking transaction.
2. В PostgreSQL использовать exclusion constraint по `space_id` + time range для подтвержденных броней.
3. При оплате создавать временный hold с TTL.
4. После успешной оплаты подтверждать booking.
5. Если внешний write-back failed — booking получает `sync_pending` и уходит в retry queue.
6. Если внешний календарь сообщил конфликт — booking уходит в `conflict_requires_resolution`.
7. Пользователю нельзя обещать “подтверждено”, пока нет внутреннего подтверждения и, для external-source объектов, успешного write-back или partner confirmation.

## 32. Payment Overlay

Payment Overlay — важный коммерческий слой.

Сценарий:

1. Расписание остается у партнера.
2. Sport Netanya показывает доступные слоты.
3. Пользователь платит картой в Sport Netanya.
4. После оплаты Sport Netanya:
   - создает booking у себя;
   - отправляет подтверждение партнеру;
   - пишет busy block во внешний календарь, если возможно;
   - отправляет данные для сверки выплат.

Если партнерская система не поддерживает write-back:

- не делать мгновенную бронь;
- использовать заявку с оплатой после подтверждения или pre-authorization, если платежный провайдер поддерживает.

## 33. Partner Webhook API

Партнерам и Make/Zapier дать простой webhook endpoint.

Endpoint:

```txt
POST /partner-webhooks/:partnerId/events
```

Payload:

```json
{
  "event_id": "evt_123",
  "event_type": "session.updated",
  "occurred_at": "2026-06-18T10:00:00+03:00",
  "source": "partner_system",
  "data": {
    "external_session_id": "abc123",
    "space_name": "Court 2",
    "coach_name": "Daniel Cohen",
    "sport": "padel",
    "starts_at": "2026-06-20T18:00:00+03:00",
    "ends_at": "2026-06-20T19:00:00+03:00",
    "capacity": 4,
    "booked_count": 2,
    "price": 120,
    "currency": "ILS",
    "status": "available"
  }
}
```

Правила:

- все webhooks проверять по signature;
- все события должны быть idempotent;
- если event уже обработан, не создавать дубликат;
- все события писать в `sync_webhook_events`;
- обработку делать через queue.

## 34. Минимальные connectors для MVP

### Must-have

1. Manual/CSV/Excel import.
2. Google Calendar connector.
3. Microsoft Calendar connector.
4. iCal/ICS read-only connector.
5. Generic Webhook connector for Zapier/Make.
6. Internal Sport Netanya calendar.

### Should-have после MVP

1. Arbox connector.
2. Boostapp connector.
3. Tazman connector or Tazman bridge through Google Calendar/Make/Zapier.
4. Cronofy/Nylas adapter evaluation as managed calendar infrastructure.

## 35. Почему не строить все connectors сразу

Потому что у каждой системы разные права, модели данных, API-лимиты, webhook-поддержка и юридические условия.

Правильный путь:

1. Сначала построить единый internal data contract.
2. Потом подключить универсальные источники: Google, Microsoft, ICS, CSV, Generic Webhook.
3. Потом подключать прямые B2B-системы по мере переговоров.
4. Не завязывать booking engine на конкретного провайдера.

## 36. AAA+ фичи 2026

### 36.1. Zero-downtime migration

Партнер может перейти в 3 этапа:

1. Mirror mode — только отображение.
2. Assisted booking — заявки и подтверждение.
3. Full booking — мгновенная запись и оплата.

### 36.2. LiveSync Quality Badge

В кабинете партнера показывать:

- last sync;
- webhook status;
- failed events;
- conflicts;
- bookable percentage;
- revenue from synced slots.

### 36.3. Smart Mapper

AI/heuristic mapping:

- распознать вид спорта по названию;
- распознать возраст;
- распознать район;
- связать тренера с группой;
- связать календарь с конкретным space.

### 36.4. Conflict radar

До go-live показать:

- пересекающиеся занятия;
- слоты без цены;
- занятия без тренера;
- занятия без capacity;
- разные названия одного тренера;
- разные названия одной площадки.

### 36.5. SportIL Availability Standard

Создать публичную спецификацию:

- `/availability/query`
- `/bookings/hold`
- `/bookings/confirm`
- `/bookings/cancel`
- `/webhooks/booking-created`
- `/webhooks/booking-cancelled`
- `/webhooks/availability-changed`

Это может стать будущим стандартом для муниципалитетов и спортивных систем Израиля.

## 37. Acceptance criteria для SportSync Hub

1. Партнер может подключить Google Calendar через OAuth.
2. Партнер может подключить iCal URL.
3. Партнер может загрузить CSV/Excel и увидеть preview.
4. Партнер может подключить Generic Webhook и отправить тестовое событие.
5. Система создает external mappings и требует подтверждения партнера.
6. Система умеет отличать busy block от bookable slot.
7. Система не показывает instant booking для read-only источника без write-back.
8. Система показывает sync health в админке.
9. Система пишет все sync events и errors.
10. Система умеет retry failed events.
11. Система предотвращает double booking внутренними constraints.
12. Система сохраняет external IDs для дедупликации.
13. Система поддерживает source-of-truth режимы: external, internal, hybrid.
14. Система может включить Payment Overlay только для подтвержденных bookable slots.

## 38. Инструкция Codex для реализации Sync Hub

Добавить пакет:

```txt
/packages/sync-hub
```

Структура:

```txt
/packages/sync-hub
  /connectors
    google-calendar.connector.ts
    microsoft-calendar.connector.ts
    ics.connector.ts
    csv-import.connector.ts
    webhook.connector.ts
    mock.connector.ts
  /core
    connector.interface.ts
    sync-engine.ts
    mapping-engine.ts
    availability-normalizer.ts
    conflict-detector.ts
    confidence-score.ts
  /jobs
    initial-sync.job.ts
    incremental-sync.job.ts
    webhook-event.job.ts
    reconciliation.job.ts
  /types
    sync.types.ts
    external-event.types.ts
```

Backend endpoints:

- `GET /integrations/providers`
- `POST /integrations/connect`
- `POST /integrations/:id/test`
- `POST /integrations/:id/initial-sync`
- `GET /integrations/:id/preview`
- `POST /integrations/:id/confirm-mapping`
- `POST /integrations/:id/go-live`
- `GET /integrations/:id/health`
- `POST /partner-webhooks/:partnerId/events`

Admin endpoints:

- `GET /admin/sync/health`
- `GET /admin/sync/errors`
- `POST /admin/sync/errors/:id/retry`
- `GET /admin/sync/conflicts`
- `POST /admin/sync/conflicts/:id/resolve`

## 39. Итоговая стратегия

Sport Netanya не должен начинать как “замена всем планировщикам”. Это слишком тяжело и вызовет сопротивление.

Правильная стратегия:

> Сначала стать единым интерфейсом и платежным слоем поверх существующих расписаний. Потом постепенно стать главным операционным календарем там, где партнерам это выгодно.

Так мы получаем быстрый onboarding, меньше сопротивления от площадок, live-актуальность, card payments и возможность масштабироваться от Нетании к SportIL.


---

# Дополнение v1.0: единый UX и реализация без потерь данных

Этот раздел превращает продуктовую и техническую спецификацию выше в конкретную систему для реализации. Его задача — убрать риск, что Codex реализует “мощный backend, но неудобный продукт”.

## 40. UX North Star

Главный UX-принцип:

> Пользователь не должен понимать, как устроены площадки, календари, внешние CRM, API и платежные провайдеры. Он должен видеть простой ответ: где заниматься, когда свободно, сколько стоит, можно ли записаться и оплатить.

Для тренера:

> Тренер должен за 5 минут понять, кто записался, кто оплатил, кто пришел, где есть свободные места и сколько денег ожидается к выплате.

Для площадки:

> Менеджер площадки должен видеть загрузку, свободные часы, брони, оплаты, блокировки, конфликты и подключение текущего календаря в одном кабинете.

Для города:

> Муниципалитет должен видеть не персональные данные, а агрегированную спортивную картину: спрос, загрузка, районы, часы, виды спорта, нехватка объектов.

## 41. Information Architecture: единая структура продукта

### 41.1. Public/User App

```txt
/home
/search
/map
/facilities/:id
/coaches/:id
/programs/:id
/slots/:id
/checkout/:bookingId
/my-sport
/my-sport/bookings
/my-sport/payments
/my-sport/family
/my-sport/notifications
/profile
```

### 41.2. Coach Portal

```txt
/coach
/coach/onboarding
/coach/dashboard
/coach/calendar
/coach/programs
/coach/programs/:id
/coach/students
/coach/bookings
/coach/attendance
/coach/payments
/coach/sync
/coach/settings
```

### 41.3. Facility Portal

```txt
/facility
/facility/onboarding
/facility/dashboard
/facility/spaces
/facility/calendar
/facility/bookings
/facility/pricing
/facility/blocks
/facility/sync
/facility/payments
/facility/reports
/facility/settings
```

### 41.4. Admin Panel

```txt
/admin
/admin/dashboard
/admin/partners
/admin/facilities
/admin/coaches
/admin/programs
/admin/bookings
/admin/payments
/admin/refunds
/admin/sync-health
/admin/conflicts
/admin/reports
/admin/city-dashboard
/admin/audit-logs
/admin/settings
```

## 42. Главный экран пользователя

### 42.1. Цель экрана

За 5–10 секунд пользователь должен понять, что можно сделать:

1. найти тренировку для себя;
2. найти секцию для ребенка;
3. забронировать площадку;
4. посмотреть спорт рядом на карте;
5. открыть свои записи.

### 42.2. UI-блоки главного экрана

```txt
[Header]
  Logo: Sport Netanya
  Location: Netanya / Current area
  Profile icon

[Hero Search]
  “Что ищем?”
  chips: Для ребенка / Для себя / Площадка / Тренер / Сегодня

[Quick filters]
  Спорт
  Возраст
  Район
  Сегодня/завтра/выходные
  До 50₪ / 50–100₪ / 100₪+

[Primary CTA]
  Найти спорт

[Smart sections]
  Свободно сегодня
  Популярно рядом
  Детские секции
  Новые площадки
  Пробные тренировки
```

### 42.3. UX-правила

- Не показывать сразу сложные фильтры.
- Сначала дать быстрый выбор, потом расширенные фильтры.
- Для родителей по умолчанию предлагать возраст ребенка.
- Пользователь не должен видеть технические слова `slot`, `sync`, `external source`, `confidence score`.
- Вместо этого показывать: “Можно записаться”, “Нужно подтверждение”, “Только информация”, “Недоступно”.

## 43. Поиск и карта

### 43.1. Режимы выдачи

Пользователь может переключаться:

- список;
- карта;
- “свободно сегодня”;
- “рядом со мной”.

### 43.2. Карточка результата

Каждый результат должен иметь:

```txt
[Название]
[Спорт + район]
[Возраст/уровень, если программа]
[Цена]
[Ближайшее свободное время]
[Статус актуальности]
[CTA]
```

CTA зависит от режима:

| Статус | CTA |
|---|---|
| `bookable` | Записаться |
| `payment_enabled` | Записаться и оплатить |
| `request_only` | Отправить заявку |
| `info_only` | Посмотреть контакты |
| `blocked` | Недоступно |

### 43.3. Фильтры

MVP-фильтры:

- спорт;
- возраст;
- район;
- день недели;
- время дня;
- цена;
- уровень;
- индивидуально/группа;
- доступно к онлайн-записи;
- пробная тренировка;
- язык тренера;
- доступность для людей с ограничениями.

## 44. Карточка площадки

### 44.1. Структура

```txt
Facility Header
  Фото
  Название
  Район + адрес
  Статус: можно записаться / требуется подтверждение / только информация

Tabs
  1. Свободное время
  2. О площадке
  3. Тренировки здесь
  4. Правила
  5. Фото

Primary CTA
  Выбрать время / Отправить заявку / Позвонить / Сообщить об ошибке
```

### 44.2. Свободное время

Показывать не “календарь для админа”, а простой слот-пикер:

```txt
Сегодня
  16:00 17:00 18:00 20:00
Завтра
  09:00 10:00 18:00
Выходные
  Сб 11:00 / Вс 17:00
```

Фильтры внутри карточки:

- конкретное пространство: корт 1, поле 2, зал;
- длительность;
- цена;
- освещение;
- крытая/открытая площадка.

## 45. Карточка тренера / секции

### 45.1. Структура

```txt
Coach/Program Header
  Фото
  Имя тренера / название школы
  Вид спорта
  Возраст
  Район
  Языки
  Статус записи

Main info
  Для кого
  Уровень
  Расписание
  Цена
  Пробная тренировка
  Место проведения
  Что взять с собой

CTA
  Записаться / Пробная тренировка / Задать вопрос через заявку
```

### 45.2. Важное правило для детей

Для несовершеннолетних запись должна идти через родителя/опекуна. В MVP не делать прямой чат взрослого тренера с ребенком.

## 46. Checkout и привязка карты

### 46.1. Цель

Оплата должна быть простой и доверительной. Пользователь должен понимать:

- за что платит;
- кому платит;
- когда занятие;
- какие правила отмены;
- что карта хранится безопасно через платежного провайдера.

### 46.2. Checkout screen

```txt
[Booking summary]
  Футбол дети 7–9
  Вторник, 18:00–19:00
  Поле №2, Нетания
  Тренер: Daniel
  Цена: 60₪

[Cancellation policy]
  Можно отменить до ...

[Payment method]
  Добавить карту / выбрать сохраненную карту

[Total]
  60₪

[CTA]
  Подтвердить и оплатить
```

### 46.3. Payment states

- `needs_card` — нужна карта;
- `card_setup_pending` — пользователь у провайдера;
- `payment_processing` — платеж обрабатывается;
- `payment_success` — запись подтверждена;
- `payment_failed` — слот освобожден или hold сохраняется короткое время;
- `refund_pending`;
- `refunded`.

## 47. My Sport: личный кабинет пользователя

### 47.1. Что должно быть

```txt
/my-sport
  Следующая тренировка
  Все записи
  Профили детей
  Карты
  История оплат
  Уведомления
  Избранное
  Лист ожидания
```

### 47.2. Родительский сценарий

Родитель может:

- добавить ребенка;
- указать возраст;
- указать район;
- сохранить предпочтения;
- записать ребенка на пробную тренировку;
- оплатить своей картой;
- получить напоминание;
- видеть историю посещений.

## 48. Coach Portal UX

### 48.1. Принцип

Тренеру не нужен сложный enterprise-интерфейс. Ему нужны ответы:

- кто сегодня приходит;
- кто оплатил;
- кто не оплатил;
- где свободные места;
- сколько новых заявок;
- сколько денег ожидается.

### 48.2. Dashboard тренера

```txt
Сегодня
  3 тренировки
  24 ученика
  2 пробные
  1 неоплаченная запись

Ближайшие действия
  Подтвердить 2 заявки
  Отметить посещаемость
  Проверить оплату

Деньги
  Оплачено за неделю
  Ожидается выплата
```

### 48.3. Календарь тренера

Виды:

- день;
- неделя;
- список;
- группы.

Каждое занятие показывает:

- время;
- место;
- группа;
- записано / вместимость;
- оплачено;
- статус sync;
- быстрые действия: отметить посещаемость, отменить, написать группе через уведомление.

### 48.4. Создание программы тренером

Wizard:

1. Вид спорта.
2. Возраст и уровень.
3. Индивидуально или группа.
4. Место.
5. Дни и время.
6. Вместимость.
7. Цена.
8. Правила отмены.
9. Опубликовать.

## 49. Facility Portal UX

### 49.1. Принцип

Площадке нужно управлять объектом и загрузкой, а не разбираться в технической синхронизации.

### 49.2. Dashboard площадки

```txt
Сегодня
  12 броней
  72% загрузка
  4 свободных часа
  1 конфликт синхронизации

Доход
  Оплачено сегодня
  Ожидается выплата

Свободные окна
  16:00–17:00 Court 2
  21:00–22:00 Field 1

Рекомендации
  Сделать промо на свободное окно
  Включить waitlist на вечерние часы
```

### 49.3. Spaces management

Площадка должна управлять не только объектом, а конкретными пространствами:

```txt
Facility: Sport Center Netanya
  Space: Court 1
  Space: Court 2
  Space: Basketball Hall
  Space: Small Training Room
```

Для каждого `space`:

- спорт;
- покрытие;
- размер;
- вместимость;
- цена;
- правила;
- часы работы;
- доступность к онлайн-бронированию;
- внешний resource mapping.

### 49.4. Facility calendar

Площадка должна видеть:

- брони пользователей;
- тренировки школ;
- блокировки;
- ремонт;
- турниры;
- внешние busy blocks;
- конфликты.

## 50. One Button Connect UX

### 50.1. Экран входа

```txt
“Как вы сейчас ведете расписание?”

[Google Calendar]
[Outlook / Microsoft 365]
[Apple / iCloud]
[Boostapp]
[Arbox]
[Tazman]
[Excel / Google Sheets]
[Zapier / Make]
[Другая система]
[У меня нет системы]
```

### 50.2. Подключение

Для каждого типа показывать только нужные поля:

| Источник | Что просим |
|---|---|
| Google Calendar | OAuth login + выбрать календарь |
| Microsoft | OAuth login + выбрать календарь |
| ICS | вставить iCal URL |
| Excel/CSV | загрузить файл |
| Webhook | показать endpoint + secret |
| API key systems | API key + business id, если нужно |
| No system | создать расписание вручную у нас |

### 50.3. Preview after import

После импорта показать человеку понятный результат:

```txt
Мы нашли:
  3 площадки
  7 тренеров
  28 будущих тренировок
  14 свободных слотов

Нужно проверить:
  4 события без цены
  2 события без вместимости
  1 конфликт времени
```

CTA:

```txt
[Проверить и продолжить]
```

### 50.4. Mapping screen

Не показывать сложные technical ids.

Показывать так:

```txt
Внешний календарь: “Court 2”
Соответствует в Sport Netanya: [выбрать пространство]

Внешнее событие: “Kids football 7-9”
Это: [Программа] [Группа] [Тренер]
```

### 50.5. Go-live modes

После mapping партнер выбирает режим:

- только показывать расписание;
- принимать заявки;
- разрешить запись;
- разрешить запись + оплату;
- полностью перейти на Sport Netanya.

Система должна объяснить последствия простыми словами.

## 51. Live actuality UX

Пользователю нельзя показывать внутренний score, но нужно показывать доверие.

| Internal state | User label | Partner/admin label |
|---|---|---|
| `high_confidence` | Можно записаться | LiveSync OK |
| `medium_confidence` | Требуется подтверждение | Sync delayed / read-only |
| `low_confidence` | Уточнить наличие | Low confidence |
| `info_only` | Только информация | Not connected |
| `conflict` | Временно недоступно | Conflict requires resolution |

## 52. Unified component library

Codex должен создать reusable UI components:

```txt
SportCard
FacilityCard
CoachCard
ProgramCard
SlotPicker
AvailabilityBadge
PriceBadge
MapListToggle
BookingSummary
PaymentMethodCard
AddCardButton
CheckoutPanel
FamilyMemberSelector
WaitlistButton
EmptyState
ErrorState
LoadingSkeleton
ConnectWizard
ImportPreview
MappingTable
SyncHealthBadge
ConflictAlert
DashboardMetricCard
CalendarGrid
AttendanceList
PayoutSummary
AuditLogTable
```

### 52.1. Component rules

- компоненты должны быть reusable между user app, coach portal и facility portal;
- бизнес-логика не должна жить внутри UI-компонентов;
- статусы должны приходить из API как enum;
- тексты должны быть вынесены так, чтобы позже добавить Hebrew/Russian/English локализацию;
- UI должен поддерживать RTL для Hebrew.

## 53. UX event tracking

Codex должен заложить таблицу/события аналитики, чтобы понимать, где пользователи отваливаются.

### 53.1. User events

```txt
search_started
search_filter_applied
facility_viewed
coach_viewed
program_viewed
slot_viewed
slot_reserved
checkout_started
card_add_started
card_added
payment_success
payment_failed
booking_cancelled
waitlist_joined
report_incorrect_info
```

### 53.2. Partner events

```txt
coach_onboarding_started
coach_application_submitted
facility_onboarding_started
facility_application_submitted
sync_connect_started
sync_connect_success
sync_connect_failed
import_preview_viewed
mapping_completed
go_live_enabled
slot_created
attendance_marked
refund_requested
```

### 53.3. Admin events

```txt
partner_approved
partner_rejected
conflict_resolved
refund_approved
sync_issue_acknowledged
facility_status_changed
coach_status_changed
```

## 54. Data model additions for unified UX

Добавить к уже описанной базе:

```txt
user_preferences
saved_searches
favorite_items
recently_viewed_items
onboarding_sessions
onboarding_steps
ui_event_logs
partner_go_live_checklists
localization_strings
support_tickets
```

### 54.1. `onboarding_sessions`

Поля:

```txt
id
partner_type: coach | facility | organization
partner_id
current_step
status: started | pending_input | pending_admin_review | completed | abandoned
created_at
updated_at
completed_at
```

### 54.2. `partner_go_live_checklists`

Поля:

```txt
id
partner_id
has_profile
has_payment_account
has_cancellation_policy
has_at_least_one_space_or_program
has_availability
has_sync_connection
has_mapping_confirmed
can_accept_bookings
can_accept_payments
admin_approved
status
```

## 55. No-data-loss checklist

Чтобы не терять данные при интеграциях и миграциях, система должна хранить:

1. исходный внешний id объекта;
2. исходный внешний id события;
3. нормализованный внутренний id;
4. версию mapping;
5. дату последней синхронизации;
6. дату последней успешной синхронизации;
7. payload внешнего события в безопасном виде;
8. ошибку sync, если была;
9. кто подтвердил mapping;
10. историю изменений слота;
11. историю статусов booking;
12. историю платежных транзакций;
13. историю refund;
14. audit log для админ-действий;
15. snapshot доступности до и после изменения;
16. source of truth для каждого slot/program/space;
17. confidence score на момент показа пользователю;
18. confidence score на момент оплаты;
19. webhook event id для дедупликации;
20. idempotency key для платежей и booking операций.

## 56. Idempotency rules

Все критические операции должны быть idempotent:

```txt
POST /bookings/reserve
POST /bookings/:id/confirm-payment
POST /payments/setup-session
POST /payments/webhooks/:provider
POST /sync/webhooks/:connectionId
POST /facility/slots/block
POST /coach/attendance
```

Использовать:

```txt
idempotency_key
request_hash
operation_type
created_by
expires_at
result_payload
```

## 57. Error handling UX

### 57.1. Для пользователя

Не показывать технические ошибки.

Примеры:

| Ситуация | Текст |
|---|---|
| slot already taken | Это время только что заняли. Выберите другое время. |
| payment failed | Платеж не прошел. Проверьте карту или выберите другую. |
| sync delayed | Сейчас нужно подтверждение площадки. Мы отправим заявку. |
| no results | Пока нет подходящих вариантов. Можно изменить район, время или встать в список интереса. |

### 57.2. Для партнера

Показывать действие:

| Ситуация | Текст |
|---|---|
| mapping missing | Нужно сопоставить внешний календарь с площадкой/группой. |
| sync failed | Подключение не обновилось. Проверьте доступ или подключите заново. |
| conflict found | Найдено пересечение времени. Выберите, какая запись остается активной. |
| payment account missing | Добавьте платежные реквизиты, чтобы принимать оплату картой. |

## 58. Admin operational workflows

### 58.1. Partner approval

```txt
Application submitted
  ↓
Admin reviews profile
  ↓
Admin checks payment readiness
  ↓
Admin checks sync/mapping if connected
  ↓
Admin approves info_only / booking / payment mode
  ↓
Partner goes live
```

### 58.2. Conflict resolution

```txt
Conflict detected
  ↓
Slot temporarily hidden or switched to request mode
  ↓
Admin/partner chooses source of truth
  ↓
Booking adjusted/cancelled/refunded if needed
  ↓
Audit log written
  ↓
Confidence recalculated
```

### 58.3. Payment issue resolution

```txt
Payment failed / webhook delayed / refund requested
  ↓
Admin views transaction timeline
  ↓
System compares provider status with internal status
  ↓
Admin triggers reconciliation or refund
  ↓
User and partner receive notification
```

## 59. Implementation backlog for Codex

### Epic 0 — Foundation

- create monorepo;
- configure TypeScript;
- setup Next.js app;
- setup NestJS API;
- setup Prisma;
- setup PostgreSQL + PostGIS;
- setup Redis/BullMQ;
- setup shared types package;
- setup lint/test scripts;
- create Docker Compose.

### Epic 1 — Auth/RBAC

- implement user registration/login;
- implement refresh tokens;
- implement roles;
- implement organization memberships;
- implement parent/child profiles;
- implement guards in API.

### Epic 2 — Catalog

- sports;
- facilities;
- spaces;
- coaches;
- programs;
- public search;
- map coordinates;
- info_only vs bookable display;
- saved searches/favorites.

### Epic 3 — Partner onboarding

- coach application;
- facility application;
- organization application;
- onboarding sessions;
- go-live checklist;
- admin approval;
- partner profile editor.

### Epic 4 — SportSync Hub

- connector interface;
- mock connector;
- CSV import;
- ICS connector;
- Google Calendar connector skeleton;
- Microsoft Calendar connector skeleton;
- generic webhook connector;
- initial sync job;
- incremental sync job;
- mapping engine;
- import preview;
- conflict detector;
- confidence score;
- sync health dashboard.

### Epic 5 — Availability/Booking

- availability rules;
- slots;
- busy blocks;
- slot search;
- hold/reserve;
- confirm booking;
- cancel booking;
- waitlist;
- database exclusion constraint against overlap;
- booking state machine;
- integration with confidence score.

### Epic 6 — Payments

- PaymentProvider interface;
- MockPaymentProvider;
- setup session;
- tokenized payment methods;
- one-time charge;
- webhooks;
- refunds skeleton;
- payout reporting skeleton;
- payment overlay rules;
- payment reconciliation job.

### Epic 7 — Portals/UI

- user app pages;
- coach dashboard;
- facility dashboard;
- admin panel;
- slot picker;
- checkout;
- connect wizard;
- mapping UI;
- sync health UI;
- conflict UI;
- simple responsive layout;
- RTL-ready UI structure.

### Epic 8 — Notifications/Analytics

- notification adapter;
- email/push/SMS placeholders;
- reminders;
- booking confirmations;
- cancellation notifications;
- ui event logging;
- platform analytics;
- facility analytics;
- coach analytics;
- city dashboard.

### Epic 9 — QA/Seed/Docs

- seed data for Netanya MVP;
- unit tests;
- integration tests;
- e2e happy paths;
- e2e double booking tests;
- payment failure tests;
- sync conflict tests;
- README;
- environment variables docs.

## 60. Critical tests Codex must implement

### 60.1. Booking tests

1. user can reserve available slot;
2. second user cannot reserve same slot at same time;
3. expired hold releases slot;
4. cancelled booking releases slot if rules allow;
5. booking cannot be confirmed without payment when payment is required;
6. booking cannot be created for `info_only` facility.

### 60.2. Payment tests

1. user can add tokenized card through mock provider;
2. successful payment confirms booking;
3. failed payment releases or expires hold;
4. duplicate webhook does not duplicate payment;
5. refund updates booking/payment status;
6. raw card data is never saved.

### 60.3. Sync tests

1. CSV import creates preview, not live data immediately;
2. mapping is required before go-live;
3. external busy block removes slot from bookable availability;
4. webhook duplicate is ignored using external event id;
5. sync failure lowers confidence score;
6. read-only source cannot enable instant payment mode unless manual confirmation/hold logic exists.

### 60.4. UX/role tests

1. guest can search but cannot book without login;
2. parent can book for child;
3. coach sees only own students/bookings;
4. facility manager sees only own facility/spaces;
5. city viewer sees aggregated analytics only;
6. platform admin can approve/reject partners.

## 61. Seed data for demo

Create demo data:

```txt
Sports:
  Football
  Basketball
  Tennis
  Padel
  Swimming
  Martial Arts

Facilities:
  Netanya Sport Center
  Ir Yamim Community Court
  Beach Volleyball Netanya
  School Gym Example
  Padel Club Example

Spaces:
  Football Field 1
  Basketball Hall 1
  Tennis Court 1
  Padel Court 1
  Beach Court 1
  School Gym 1

Coaches:
  5 demo coaches

Programs:
  Kids football 7-9
  Basketball teens 13-15
  Padel beginners adults
  Tennis private lesson
  Martial arts kids

Slots:
  At least 50 future slots

Users:
  demo parent
  demo child
  demo adult athlete
  demo coach
  demo facility manager
  demo admin
```

## 62. Final Codex instruction block

Use this block as the direct implementation instruction:

```txt
Build Sport Netanya MVP as a production-grade monorepo with Next.js web/PWA, NestJS API, Prisma, PostgreSQL/PostGIS, Redis/BullMQ, shared TypeScript types, mock payment provider, mock notification provider, and SportSync Hub.

Implement the core product as one integrated system:
- public sport catalog;
- user/parent accounts;
- coach onboarding and portal;
- facility onboarding and portal;
- booking engine with holds and double-booking protection;
- tokenized card payment flow through PaymentProvider adapter;
- SportSync Hub for CSV/ICS/Google/Microsoft/webhook style integrations;
- admin moderation panel;
- city analytics dashboard;
- simple mobile-first UX.

Do not store raw card data.
Do not allow instant booking/payment for low-confidence or info-only slots.
Do not allow overlapping confirmed bookings for the same space.
Do not mix connector-specific logic inside booking/payment domain logic.
Use normalized entities and adapters.
Add tests for double booking, payment webhooks, sync conflicts, role permissions and onboarding.
Seed the app with demo Netanya sports data.
```

## 63. Definition of Done for MVP

MVP считается готовым, когда:

1. обычный пользователь может найти спорт и записаться;
2. родитель может записать ребенка;
3. тренер может подключиться, пройти approval и создать тренировки;
4. площадка может подключиться, создать spaces и слоты;
5. партнер может подключить внешний календарь или импортировать расписание;
6. пользователь видит актуальность простыми словами;
7. пользователь может привязать карту через безопасный provider flow;
8. пользователь может оплатить bookable slot;
9. double booking технически невозможен;
10. тренер/площадка видит записи и оплаты;
11. админ видит заявки, конфликты, sync health и платежи;
12. город видит агрегированную аналитику;
13. все critical actions пишутся в audit log;
14. есть seed data и тесты;
15. продукт можно показать как 90-дневный пилот для Нетании.

## 64. Главный итог

Sport Netanya должен начинаться как MVP для Нетании, но архитектурно сразу быть готовым к SportIL.

Ключ не в том, чтобы заменить все системы сразу. Ключ в том, чтобы стать единым слоем поверх них:

```txt
Existing calendars + trainers + facilities + city data
      ↓
SportSync Hub normalizes actuality
      ↓
Sport Netanya shows simple availability
      ↓
Booking engine sells reliable slots
      ↓
Payment overlay moves market from cash to cards
      ↓
Analytics proves higher sport participation and facility utilization
```

Главная ценность для рынка:

> больше людей занимается спортом, площадки меньше простаивают, тренеры получают оплаченные записи, город видит реальные данные, а пользователи получают простой путь от поиска до оплаты.
