# SPEC.md — Daymaker.com · Pełna specyfikacja re-implementacji

| Pole | Wartość |
|---|---|
| Wersja | 1.0 |
| Data | 2026-04-21 |
| Źródło analizy | https://www.daymaker.com (Home, Software, Integrations, About, Contact, Locations/Oslo) |
| Stack docelowy | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Zakres | Publiczny serwis marketingowy (bez panelu SaaS mieszkającego na trydaymaker.com) |

---

## Spis treści

1. Prompt startowy dla Claude Code
2. Kontekst produktu
3. Mapa stron (Information Architecture)
4. Stack i decyzje techniczne
5. Design system (tokeny, typografia, kolory, komponenty globalne)
6. Globalna nawigacja i footer
7. Specyfikacja stron
   - 7.1 Home `/`
   - 7.2 Software `/software`
   - 7.3 Integrations `/explore-integrations`
   - 7.4 About `/about`
   - 7.5 Contact `/contact-us`
   - 7.6 Locations `/locations/oslo` + szablon „coming soon"
8. Content schema (TypeScript + JSON)
9. Struktura repozytorium
10. Zadania implementacyjne (krok po kroku)
11. Obsługa formularzy i integracje runtime
12. SEO, performance, dostępność
13. Testy i jakość
14. Różnice od oryginału (celowe uproszczenia)
15. Kryteria akceptacji
16. Poza zakresem
17. Załączniki
    - A. Pełne treści tortów (Oslo)
    - B. Pełne testymoniale
    - C. Pełne FAQ
    - D. Pełna lista integracji (81 pozycji)
    - E. Dane kontaktowe i biura

---

## 1. Prompt startowy dla Claude Code

> Zaimplementuj kompletny marketingowy serwis Daymaker na podstawie tej specyfikacji. Stack: Next.js 14 App Router + TypeScript strict + Tailwind CSS. Strona ma 6 aktywnych routów (`/`, `/software`, `/explore-integrations`, `/about`, `/contact-us`, `/locations/oslo`) oraz 5 placeholderów lokalizacji ze statusem „coming soon". Zachowaj zgodność treści 1:1 (łącznie z oryginalnymi literówkami), responsywność i dostępność. Nie używaj Webflow, jQuery, Swiper ani zewnętrznych skryptów z oryginału — wszystko natywnie (React, Tailwind, Framer Motion, Embla, Radix UI). Pracuj iteracyjnie: scaffold → tokeny → komponenty globalne → strony w kolejności sekcji 10 → testy → Lighthouse CI.

---

## 2. Kontekst produktu

Daymaker to SaaS B2B, który automatyzuje dostawę tortów urodzinowych dla pracowników biurowych. Łączy własne oprogramowanie (CRM + reguły + tracking zamówień) z siecią lokalnych piekarni. Witryna publiczna służy: pozyskiwaniu leadów (formularz demo, rejestracja), komunikowaniu oferty (automatyzacja urodzin), prezentacji integracji z 60+ HRIS, budowaniu marki i historii (About + Timeline) oraz lokalnym landingom miast. Panel klienta (logowanie, dashboard) jest osobną aplikacją pod subdomeną `trydaymaker.com` i nie wchodzi w zakres tego projektu.

---

## 3. Mapa stron

Aktywne routy: `/` Home, `/software` Our Software, `/explore-integrations` Integrations, `/about` About, `/contact-us` Contact + FAQ, `/locations/oslo` Oslo location. Placeholder routy (szablon „coming soon"): `/locations/bergen`, `/locations/stavanger`, `/locations/san-francisco`, `/locations/new-york`, `/locations/florida`. Linki zewnętrzne (nie implementujemy): `https://www.trydaymaker.com/` (Log in), `https://www.trydaymaker.com/register` (Sign up / Start Celebrating).

---

## 4. Stack i decyzje techniczne

Next.js 14 (App Router, RSC), TypeScript strict, Tailwind CSS z customowym theme, `next/font/google` dla Host Grotesk, `next/image` dla wszystkich obrazów. Biblioteki dodatkowe: `framer-motion` (mikro-animacje, fade-in on scroll), `embla-carousel-react` (karuzela News), `@radix-ui/react-accordion` + `@radix-ui/react-dialog` (FAQ, Founder's letter, MobileMenu), `lucide-react` (ikony), `clsx` + `tailwind-merge`, `zod` (walidacja formularza), `resend` (wysyłka emaili), `@upstash/ratelimit` (rate-limit formularza). Jakość: ESLint + Prettier + Vitest + Testing Library + Playwright. Runtime: Node 20, pnpm 9. Deploy: Vercel.

---

## 5. Design system

### 5.1 Typografia

Font: **Host Grotesk** (Google Fonts), wagi 400/500/600/700/800, fallback `system-ui, sans-serif`. Skala: H1 40/56/64 px (mobile/md/lg) weight 800 letter-spacing -0.01em, H2 28/32/36 px weight 500, H3 20/22 px weight 600, body 16–17 px weight 400 line-height 1.6, small 14 px.

### 5.2 Kolory (Tailwind theme)

```ts
colors: {
  cream:     "#FDF9F5", // tło strony
  cocoa:     "#492E25", // tekst bazowy, H2
  cocoaDark: "#37231C", // sekcje dark, tekst na amber
  cocoaDeep: "#2C1A13", // akcent najciemniejszy
  amber:     "#D8A060", // primary CTA
  amberHover:"#C48E50",
  white:     "#FFFFFF"
}
```

### 5.3 Kształty i cienie

Radius `btn: 16`, `card: 20`, `chip: 999`. Cień karty `0 8px 24px rgba(55,35,28,0.08)`. Container max-w 1200px, padding-x 24/40 px.

### 5.4 Komponenty globalne

`Button` (warianty `primary` amber, `dark` cocoaDark, `white`, `outline`; rozmiary sm/md/lg), `Container`, `SectionTitle`, `Chip`, `Card`, `Accordion`, `Marquee` (CSS keyframes, `prefers-reduced-motion` aware), `LogoTicker`, `NewsCarousel` (Embla), `FinalCtaDark`, `PressQuote`.

---

## 6. Globalna nawigacja i footer

### 6.1 Nav (desktop + mobile)

Sticky top. Na hero strony z ciemnym tłem: przezroczysty + białe logo. Na pozostałych: kremowe tło + logo w wariancie dark. Struktura: logo → Locations (dropdown z flagami NO: Oslo / Bergen soon / Stavanger soon; US: San Francisco soon / New York soon / Florida soon) → Our software `/software` → Integrations `/explore-integrations` → About `/about` → Contact us `/contact-us` → link „Schedule a demo" `/contact-us` → „Log in" (external) → CTA primary „Start Celebrating" (external). Mobile: hamburger + full-screen slide-in Dialog; elementy `comingSoon` z opacity 50% i `aria-disabled`.

### 6.2 Footer

Blok brandu: logo + tagline „Automating employee birthday celebrations for modern teams." + CTA „Start Celebrating". Kolumna PAGES: Home, Our Software, About Daymaker, News & Insights, Contact us, Sign up. Kolumna Locations: Oslo, San Francisco (soon), Stavanger (soon), Bergen (soon), New York (soon), Florida (soon). Ikony socjalowe: Instagram, TikTok, LinkedIn. Kredyt: „Website by Advans Marketing AS".

---

## 7. Specyfikacja stron

### 7.1 Home `/`

**Meta** — title: „We are making birthdays at work unforgettable - Daymaker"; description: „Daymaker automatically plans, schedules, and delivers employee birthday celebrations. Never forget a birthday again. Join 250+ firms."

**Sekcje (od góry)**:

Hero — H1 „Making birthdays at work unforgettable", sub „We deliver cake automatically for employees, so you never forget it again.", CTA „Begin the celebration!" (external rejestracja). Tło hero: animowany marquee z nazwami miast (lista 4 pozycji powtórzona 3×: „Stavanger", „New York", „Oslo", „San Fransisco" — pisownia z oryginału).

Client logo bar — tekst „With clients like" + LogoTicker z 9 klientami (patrz `content/clients.json`).

Integrations teaser — H2 „Automating birthdays like its a piece of cake", sub „Never has it been easier to celebrate your employees' birthdays or milestones", karta z tytułem „One click to integrate with HRIS systems" i mini-tickerem 4 logotypów (ADP Run, Rippling, Simployer, UKG), przycisk „Explore HRIS systems" → `/explore-integrations`.

How it works — H2 „Daymaker automatically plans, schedules, and delivers employee celebrations"; karta „We remind you" z lead „Prior to birthdays, we'll be sure to notify you:" i listą „Two weeks in advance", „A week in advance", „A day in advance"; CTA „Sign up"; 4 kroki (H3 1–4):
1. Connect your employees — „Upload your team or connect your HR system. We store birthdays and preferences—securely."
2. Set your rules — „Pick cake size, message, and delivery. Do it once, and save it forever."
3. We automate everything — „We remind you, order, coordinate, and deliver— on time, every time."
4. Your employees feel seen — „Happier employees. Zero effort."

Przycisk pod sekcją: „Explore HRIS systems".

Testimonials — H2 „Some of the days we've made so far", sub „We spend 90 000+ hours of our lives working. Here's some of the companies making life at work memorable", 7 kart z Załącznika B (wariant Home: Philip Borge „CEO Crunched (YC F25)" „Joined SIX months ago"; Petter Reistad wariant dłuższy).

Software highlight — H2 „The cake solution", 5 kart funkcji (H3): „Set and forget birthday automation", „Centralized order overview", „GDPR-compliant data handling", „Easy to manage dashboard", „Flexible setup for teams of any size"; CTA „About our software" → `/software`.

News & Insights — karuzela (3 slajdy na desktop, 1 na mobile): „January 16, 2026 · 2 min to read · How HR teams save hours every month"; „January 13, 2026 · 4 min to read · Next stop: New York and San Francisco"; „January 06, 2026 · 3 min to read · Meet the Daymaker Oslo team behind our cakes". Press-quote pod karuzelą: „2025 · By Finansavisen · Investors lining up: Daymaker with explosive growth".

Final CTA dark — H2 „Join 250+ firms who never forget a birthday", sub „From startups to enterprises, teams use Daymaker to make people feel seen — without adding work.", przyciski „Sign up" (primary), „Explore Integrations" (outline white).

### 7.2 Software `/software`

**Meta** — title: „Software"; description: „Automate employee birthday celebrations with Daymaker's software. Simple onboarding, custom rules, order tracking, and seamless integrations for modern teams."

**Sekcje**:

Hero — H1 „This is where the magic happens", lead „Daymaker connects onboarding, rules, special occasions, and deliveries into one effortless flow. You'll never forget a day again — and you'll never have to remember one either.", sub „Birthdays, handled. Days, made.", CTA „Book a demo".

4 bloki feature (naprzemienna kompozycja obraz↔tekst, H2 każdy; zachowaj oryginalne literówki):

1. **Onboarding** (tag „Customize") — „With a simple click of a button, all your employees are uploaded. With two more clicks, all your delivery details are up and running, and you're officially ready for cake." Slogan: „Set it once. Forget about it forever."
2. **Create rules** — „Think of Daymaker as the appstore for days. All birthdays, only round ones, specific offices, specific cakes - you decide." Slogan: „Everything runs automatically."
3. **Special occasion creation** (tag „Sometimes cake just happens") — „Who likes rules? Want a cake \"Just beacuse\"- we got you!" Slogan: „Beacuse non-birthday birthdays happens." *(oryginalne literówki „beacuse" zachowane)*
4. **Order tracking management** (tag „Customize") — „Our order tracking gives you a clear overview of every upcoming celebration — who it's for, when it's happening, and what's arriving. Finally, if someone haven't behaved at work- you could always just disable a delivery with one powerful click :)"

Review card — pojedynczy cytat klienta + avatar (reuse `TestimonialCard`).

Final CTA — H2 „Sign up today!", copy „When you started your studies or got your first job, did you ever think it would lead to you having a system for cakes? Let us show you how birthdays start remembering themselves.", przycisk „Start Celebrating".

### 7.3 Integrations `/explore-integrations`

**Meta** — title: „Explore Integrations"; description: „Connect Daymaker with 60+ HR systems including BambooHR, Workday, Personio, and more. Automatic daily syncs keep employee data secure and birthdays on track."

**Sekcje**:

Hero — H1 „All Your Cake lovers on the Employee Tab", lead „Built to work with the tools you already use. Daymaker integrates with 60+ HR systems to keep employee data reliable, secure, and always in sync — no extra work required.", tag „HRIS & Data Sync", CTA „Book a demo".

Pillars — H2 „Employee data, always in sync", 3 kolumny (H3):
- **Seamless Setup** — „Connect once, done in less than 2 minutes. Link your HRIS to Daymaker and employee data flows directly into your People tab. No spreadsheets, no manual uploads."
- **Data Reliability** — „Daily automatic syncs keep everything current. New hires, departures, updated addresses—it all syncs daily. You'll never miss a birthday or send a cake to the wrong place."
- **Security & Privacy** — „Employee information stays in your HRIS. We only pull what's needed to deliver cakes."

Ecosystem — H2 „Ecosystem Compatibility", opis „We're integrated with 60+ HR systems—BambooHR, Workday, Personio, HiBob, Namely, ADP, Gusto, Rippling, and more. Don't see yours? Just ask - we're adding new integrations regularly". Grid logotypów (pierwszych 10 widocznych) + Disclosure „View full list" rozwijający pozostałe. Pełna lista w Załączniku D (81 pozycji).

Final CTA — identyczne jak `/software`: H2 „Sign up today!" + copy + „Start Celebrating".

### 7.4 About `/about`

**Meta** — title: „About Daymaker"; description: „Daymaker automates workplace celebrations globally, combining local bakeries with software to ensure no birthday is forgotten."

**Sekcje**:

Hero — kicker „The team behind the cakes", H2 „About Daymaker", paragraf „Daymaker began in Oslo with the question: could workplace celebrations be made effortless, fair, and genuinely meaningful? By combining traditional baking with modern software, Daymaker gained early traction and national attention, earning coverage across leading Nordic media. Since then, the company has grown from its first customers in Norway to an international platform, expanding to cities across Europe and the US. Today, Daymaker brings together trusted local bakeries and proprietary software to automate celebrations globally—so no one is forgotten, quality stays high, and making someone's day is always simple."

Founder's letter — toggle „Open founder's letter / Close founder's letter" (Radix Accordion), nagłówek „Founder's message":

> Daymaker started in Norway as Jubelbud — meaning "celebration messenger."
> We noticed that workplace birthdays were often forgotten.
> In the US, we saw lots of automated gifting, but little that felt real or genuine.
>
> So we built Daymaker.
> We help you make someone feel seen — without adding work.
> Birthdays are automated, and the experience is delivered in person by carefully curated local partners.
> For now, that experience is cake.
> The best cakes, delivered on time, every time.
> Ready to make someone's day?
>
> — William and Simon, Daymaker

News & Insights — reuse karuzeli z Home (te same 3 wpisy + press-quote Finansavisen).

Team — H2 „The team", sub „Passion is the name of the game", 4 karty:
- **Simon Dieu** — CCO „(chiefofcakes on X)" — „Defining strategy and direction—while never letting a birthday go uncelebrated."
- **Abeer Rao** — CTO — „At just 17, Abeer moved from India to Helsinki on his own to study quantum physics. However, he soon found quantum entanglement less interesting than cakes with Daymaker."
- **William Lindholm** — CEO — „Keeping the company on track—and ensuring every birthday cake reaches the right doorstep."
- **Ragnar Bø** — Chair of Board — „Making sure the young founders behave at the party!"

Timeline — H2 „Our journey", 4 kamienie milowe (H3):
- **Aug. 2025 — Started as the wolves of cakestreet (Jubelbud)** — „Daymaker started in a small office back in Oslo, coldcalling businesses in the middle of summer vacation. Before the summer was over. Over 100 executives had agreed to have a meeting and to hear about our cakes."
- **Sept. 2025 — Mentioned in VG, Finansavisen, Ekstrabladet, and Aftonbladet** — „A Couple of days later, the biggest news in Norway, Denmark, And Sweden reached out beacuse of our summer success. Apparently leveraging AI to build CAAS (Cake As A Software) was unheard of!"
- **Jan. 2026 — Selected for the Founders Inc.** — „Christmas morning Dec 25. we decided to apply to Founders Inc Artifact. A highly selective in-person founder residency in San Francisco. Usually, out of the thousands of applicants, high tech companies building drones and humanoids get accepted. But F Inc saw something in us and took a bet."
- **Jan. 2026 — Expanding to New York & San Francisco** — „Next up: Our vision is to be the number 1. place you go when you want to make someone's day. To do that, our coverage has to be wide and far. Let us know where you need our cakes, we'll prioritize you first on our cake-journey!"

Final CTA dark — H2 „Join 250+ companies who never forget a birthday", sub + przyciski „Sign up" i „Read about our software".

### 7.5 Contact `/contact-us`

**Meta** — title: „Contact us"; description: „Get in touch with Daymaker's team. Contact us by phone, email, or visit our offices in Oslo or San Francisco to automate employee celebrations."

**Sekcje**:

Hero — H1 „Get in touch with our team".

Form — pola: `firstName` (text, opt), `lastName` (text, opt), `email` (email, required), `message` (textarea, required, min 10 znaków). Disclaimer: „By clicking the Submit' button you acknowledge that you have read and agree to our Terms of Service." Sukces: „Thank you! Your submission has been received!" Błąd: „Oops! Something went wrong while submitting the form."

Contact details — patrz Załącznik E.

FAQ — H2 „Frequently asked questions", sub „Learn how Daymaker helps companies celebrate employees, automatically.", 5 pytań w akordeonie (Radix). Pełne treści w Załączniku C.

### 7.6 Locations `/locations/[slug]`

**Oslo** (`slug: "oslo"`) — pełna strona. Sekcje: LocationHero (fotografia bakera + H1 „Oslo, Norway" z kickerami „Start Celebrating" / „This is Daymaker in"), LogoTicker „With clients like", SloganBanner „Farm-fresh happiness in every bite", LocationIntro H2 „Daymaker in Oslo" (2 akapity o Øvre Sem Gård i Michaelu Lundze), DeliveryBadge (chip z ikoną truck „Free delivery between Drammen and Skedsmokorset"), CakeGrid H2 „Our Cakes in Oslo" (7 tortów — Załącznik A), Testimonials H2 „Testimonials from Oslo" / „Some of the days we've made so far" (wariant lokalny — 7 kart, Załącznik B), FinalCtaDark H2 „Join 250+ firms in the cake revolution".

**Coming soon** (`slug ∈ {bergen, stavanger, san-francisco, new-york, florida}`) — wspólny szablon `LocationComingSoon`: hero z flagą kraju i nazwą miasta, tekst „We're cooking something up in {city}", formularz email „Notify me when we launch" (zapis do listy powiadomień), link powrotny „Explore Oslo →". Meta: title „{City} — coming soon".

---

## 8. Content schema

### 8.1 TypeScript types (`lib/types.ts`)

```ts
export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
  comingSoon?: boolean;
  flag?: "NO" | "US";
  external?: boolean;
};

export type Location = {
  slug: string;
  country: "NO" | "US";
  city: string;
  status: "live" | "soon";
  hero?: { image: string; kicker: string; subKicker: string; headline: string };
  intro?: { pullQuote: string; title: string; body: string[] };
  delivery?: { label: string; from: string; to: string };
  seo: { title: string; description: string; ogImage?: string };
};

export type Cake = {
  id: string;
  name: string;
  nameLocal?: string;
  description: string;
  image: string;
  tags?: ("gluten-free" | "seasonal")[];
  locations: string[];
};

export type Testimonial = {
  id: string;
  quote: string;
  author: { name: string; role: string; company: string; avatar: string; companyLogo?: string };
  tenureLabel: string;
  poweredByLogo?: string;
  contexts: ("home" | "oslo" | "software")[];
};

export type ClientLogo = { name: string; src: string; order: number };

export type Integration = {
  name: string;
  logo: string;
  slug: string;
  category: "HRIS" | "Identity" | "Payroll" | "Directory" | "Other";
};

export type TeamMember = { name: string; role: string; bio: string; photo: string; socials?: { x?: string; linkedin?: string } };

export type TimelineEvent = { date: string; title: string; description: string };

export type FaqItem = { question: string; answer: string };

export type Office = { country: "NO" | "US"; address: string; phone: string };

export type BlogPost = { slug: string; title: string; date: string; readTime: string; excerpt: string; cover: string };
```

### 8.2 Pliki content

```
content/
├─ navigation.json
├─ footer.json
├─ clients.json           # 9 logotypów
├─ cakes.json             # 7 tortów (Załącznik A)
├─ testimonials.json      # 8+ (Załącznik B)
├─ integrations.json      # 81 (Załącznik D)
├─ team.json              # 4 osoby
├─ timeline.json          # 4 wydarzenia
├─ faq.json               # 5 pytań (Załącznik C)
├─ offices.json           # 2 biura (Załącznik E)
├─ press.json             # 1 quote (Finansavisen)
├─ about.json             # About copy + Founder's letter
├─ locations/
│  ├─ oslo.json
│  ├─ bergen.json ...
└─ blog/
   ├─ how-hr-teams-save-hours.mdx
   ├─ next-stop-new-york-san-francisco.mdx
   └─ meet-daymaker-oslo-team.mdx
```

---

## 9. Struktura repozytorium

```
daymaker-site/
├─ app/
│  ├─ layout.tsx
│  ├─ globals.css
│  ├─ page.tsx                        # Home
│  ├─ software/page.tsx
│  ├─ explore-integrations/page.tsx
│  ├─ about/page.tsx
│  ├─ contact-us/page.tsx
│  ├─ locations/[slug]/page.tsx
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ api/contact/route.ts            # POST — form + rate limit
├─ components/
│  ├─ nav/ (Nav, MobileMenu, NavDropdown)
│  ├─ hero/ (HomeHero, SoftwareHero, IntegrationsHero, AboutHero, LocationHero, ComingSoonHero)
│  ├─ sections/ (LogoTicker, HrisTicker, HowItWorks, TestimonialsGrid, SoftwareFeatureGrid, NewsCarousel, PressQuote, FinalCtaDark, TeamGrid, Timeline, FounderLetter, FaqList, ContactForm, ContactDetails, CakeGrid, DeliveryBadge, IntegrationGrid, IntegrationPillars)
│  ├─ ui/ (Button, Container, SectionTitle, Accordion, Chip, Card, Marquee)
│  └─ Footer.tsx
├─ content/ (jw.)
├─ lib/ (types.ts, content.ts, seo.ts, validators.ts, email.ts, ratelimit.ts)
├─ public/images/ (hero, bakery, cakes, clients, testimonials, integrations, team, logos)
├─ tests/ (unit, e2e)
├─ tailwind.config.ts
├─ next.config.mjs
├─ tsconfig.json
├─ package.json
├─ .env.example
└─ README.md
```

---

## 10. Zadania implementacyjne (kolejność PR-ów)

1. **Scaffold** — Next.js 14 + TS strict + Tailwind + ESLint + Prettier + pnpm; `next/font` Host Grotesk; tokeny z sekcji 5 w `tailwind.config.ts`.
2. **Typy i loadery** — `lib/types.ts` + `lib/content.ts` (czytanie JSON z `fs` w RSC; cache).
3. **Content seed** — wszystkie pliki z sekcji 8.2, uzupełnione treściami 1:1 z Załączników A–E.
4. **UI primitives** — `Button`, `Container`, `SectionTitle`, `Accordion`, `Chip`, `Card`, `Marquee` + Storybook (opcjonalnie).
5. **Globalne** — `Nav` + `MobileMenu` + `Footer` + dropdown Locations.
6. **Home** — wszystkie sekcje z 7.1.
7. **Software** — 7.2 (4 feature blocks + review + final CTA).
8. **Integ[…treść zostala uciętą w źródle]**

---

> **UWAGA:** treść źródłowa została ucięta — dokument kończy się w trakcie sekcji 10 (punkt 8 „Integ..."). Załączniki A–E nie zostały dostarczone. Jeśli wrócimy do tej specyfikacji, należy uzupełnić brakujące dane: pełna lista 81 integracji, 7 tortów Oslo, 7 testimoniali, 5 pytań FAQ, 2 biura.
