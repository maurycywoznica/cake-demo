import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Cake, Calendar, Bell, Shield, Sparkles, CheckCircle2, XCircle, Users, Heart,
  Zap, LayoutDashboard, Settings, Clock, TrendingUp, Star, ArrowRight, Menu, X,
  ChevronDown, MapPin, Award, Gift, PartyPopper, Briefcase, Rocket, Snowflake,
  Mail, Linkedin, Instagram, Facebook, Moon, Sun, LogOut, Truck, Search,
  Upload, Download, Plus, Pencil, Trash2, Save, MessageSquare, MonitorSmartphone,
  Circle, Store, Phone, Building2, Package, User, ArrowLeft, ChevronRight,
  Quote, MailOpen, ShoppingBag, ChefHat, Lock, HelpCircle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   THEME CONTEXT
   ═══════════════════════════════════════════════ */
const ThemeCtx = createContext();
function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</ThemeCtx.Provider>;
}
function useTheme() { return useContext(ThemeCtx); }

/* ═══════════════════════════════════════════════
   AUTH CONTEXT
   ═══════════════════════════════════════════════ */
const AuthCtx = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('caked_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      const u = { username: 'admin', name: 'Admin BWS', role: 'admin' };
      setUser(u);
      sessionStorage.setItem('caked_user', JSON.stringify(u));
      return { ok: true };
    }
    return { ok: false, error: 'Nieprawidłowy login lub hasło' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('caked_user');
  };

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}
function useAuth() { return useContext(AuthCtx); }

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function LoginPage() {
  useTitle('Logowanie | Caked');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      setLoading(false);
      if (result.ok) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gradient-frosting opacity-20 blur-3xl" />
      <div className="absolute -left-32 bottom-20 h-[380px] w-[380px] rounded-full bg-accent2/20 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-accent text-white shadow-glow">
            <Cake className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Zaloguj się do <span className="font-caveat text-primary">Caked</span></h1>
          <p className="mt-2 text-muted-foreground">Panel zarządzania urodzinami w Twojej firmie</p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">Login</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Wpisz login..."
              required
              autoFocus
              className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wpisz hasło..."
              required
              className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Logowanie...
              </span>
            ) : (
              <>Zaloguj się <ArrowRight className="h-4 w-4" /></>
            )}
          </button>

          <div className="text-center text-xs text-muted-foreground">
            Demo: login <span className="font-mono font-semibold text-primary">admin</span> / hasło <span className="font-mono font-semibold text-primary">admin</span>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">Wróć na stronę główną</Link>
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE TITLE HOOK
   ═══════════════════════════════════════════════ */
function useTitle(t) { useEffect(() => { document.title = t; }, [t]); }

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════ */
function useInView() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}
function AnimatedNum({ target, suffix = '' }) {
  const [ref, inView] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let c = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const id = setInterval(() => { c += step; if (c >= target) { setN(target); clearInterval(id); } else setN(c); }, 16);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ═══════════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════════ */
function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-accent text-white shadow-glow"><Cake className="h-5 w-5" /></div>
      <span className="text-xl font-bold tracking-tight">Caked<span className="font-caveat text-primary">.</span></span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════
   NAVIGATION — PUBLIC
   ═══════════════════════════════════════════════ */
const SOL = [
  { l: 'Software', d: 'Poznaj nasz produkt', to: '/software' },
  { l: 'Integracje', d: 'Połącz ze swoimi narzędziami', to: '/integracje' },
  { l: 'O nas', d: 'Historia, zespół i misja', to: '/o-nas' },
  { l: 'Blog', d: 'Porady HR i nowości', to: '/blog' },
  { l: 'Oferta tortów', d: 'Katalog w 6 miastach', to: '/cakes' },
];

const CITIES_NAV = [
  { name: 'Wrocław', slug: 'wroclaw', live: true },
  { name: 'Warszawa', slug: 'warszawa', live: true },
  { name: 'Kraków', slug: 'krakow', live: true },
  { name: 'Poznań', slug: 'poznan', live: true },
  { name: 'Gdańsk', slug: 'gdansk', live: true },
  { name: 'Katowice', slug: 'katowice', live: true },
  { name: 'Łódź', slug: 'lodz', live: false },
  { name: 'Lublin', slug: 'lublin', live: false },
  { name: 'Szczecin', slug: 'szczecin', live: false },
];

function PublicNav() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [sol, setSol] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all ${scrolled ? 'border-border bg-background/85 backdrop-blur-md' : 'border-transparent bg-background/60 backdrop-blur-sm'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">Przejdź do treści</a>
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/" className="text-sm text-foreground/80 hover:text-primary">Start</Link>
          {/* Cities dropdown */}
          <div className="relative" onMouseEnter={() => setCityOpen(true)} onMouseLeave={() => setCityOpen(false)}>
            <button className="flex items-center gap-1 text-sm text-foreground/80 hover:text-primary">Miasta <ChevronDown className="h-4 w-4" /></button>
            {cityOpen && <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3"><div className="w-64 rounded-[var(--radius)] border border-border bg-card p-2 shadow-glass">
              {CITIES_NAV.map(c => (
                <Link key={c.slug} to={`/miasta/${c.slug}`} className={`flex items-center justify-between rounded-lg p-2.5 text-sm hover:bg-muted ${c.live ? '' : 'opacity-60'}`}>
                  <span>{c.name}</span>
                  {c.live ? <span className="text-[10px] font-bold uppercase text-success">Live</span> : <span className="text-[10px] font-bold uppercase text-muted-foreground">Wkrótce</span>}
                </Link>
              ))}
            </div></div>}
          </div>
          {/* Solutions dropdown */}
          <div className="relative" onMouseEnter={() => setSol(true)} onMouseLeave={() => setSol(false)}>
            <button className="flex items-center gap-1 text-sm text-foreground/80 hover:text-primary">Rozwiązania <ChevronDown className="h-4 w-4" /></button>
            {sol && <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3"><div className="w-80 rounded-[var(--radius)] border border-border bg-card p-2 shadow-glass">
              {SOL.map(s => <Link key={s.l} to={s.to} className="flex flex-col gap-0.5 rounded-lg p-3 hover:bg-muted"><span className="text-sm font-semibold">{s.l}</span><span className="text-xs text-muted-foreground">{s.d}</span></Link>)}
            </div></div>}
          </div>
          <a href="/#pricing" className="text-sm text-foreground/80 hover:text-primary">Cennik</a>
          <Link to="/kontakt" className="text-sm text-foreground/80 hover:text-primary">Kontakt</Link>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <button onClick={toggle} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted" aria-label="Toggle theme">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          <Link to="/login" className="text-sm font-medium text-foreground/80 hover:text-primary">Zaloguj się</Link>
          <Link to="/kontakt" className="btn-primary py-2 text-sm">Umów demo</Link>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
      </div>
      {open && <div className="border-t border-border bg-background lg:hidden"><div className="container flex flex-col gap-3 py-4">
        <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium">Start</Link>
        <Link to="/software" onClick={() => setOpen(false)} className="text-sm">Software</Link>
        <Link to="/integracje" onClick={() => setOpen(false)} className="text-sm">Integracje</Link>
        <Link to="/cakes" onClick={() => setOpen(false)} className="text-sm">Oferta tortów</Link>
        <Link to="/miasta/wroclaw" onClick={() => setOpen(false)} className="text-sm">Miasta</Link>
        <Link to="/o-nas" onClick={() => setOpen(false)} className="text-sm">O nas</Link>
        <Link to="/blog" onClick={() => setOpen(false)} className="text-sm">Blog</Link>
        <a href="/#pricing" onClick={() => setOpen(false)} className="text-sm">Cennik</a>
        <Link to="/kontakt" onClick={() => setOpen(false)} className="text-sm">Kontakt</Link>
        <Link to="/login" onClick={() => setOpen(false)} className="btn-primary mt-2 text-sm">Zaloguj się</Link>
      </div></div>}
    </header>
  );
}

/* ═══════════════════════════════════════════════
   LAYOUTS
   ═══════════════════════════════════════════════ */
function PublicLayout() {
  return <div className="min-h-screen"><PublicNav /><main id="main"><Outlet /></main></div>;
}

const SIDE = [
  { label: 'Przegląd', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Pracownicy', icon: Users, to: '/employees' },
  { label: 'Zamówienia', icon: Package, to: '/zamowienia' },
  { label: 'Cukiernie', icon: ChefHat, to: '/cukiernie' },
  { label: 'Profil', icon: User, to: '/profil' },
  { label: 'Ustawienia firmy', icon: Settings, to: '/company-settings' },
];

function DashboardLayout() {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ cls = '' }) => (
    <aside className={`flex h-full w-64 flex-col border-r border-border bg-card ${cls}`}>
      <div className="flex h-16 items-center px-5 border-b border-border"><Logo /></div>
      <nav className="flex-1 space-y-1 p-3">
        {SIDE.map(i => <Link key={i.to} to={i.to} onClick={() => setSideOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${pathname === i.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><i.icon className="h-5 w-5" />{i.label}</Link>)}
      </nav>
      <div className="border-t border-border p-3">
        {user && <div className="mb-2 flex items-center gap-3 px-3 py-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white text-xs font-bold">{user.name[0]}</div>
          <div><div className="text-sm font-semibold">{user.name}</div><div className="text-xs text-muted-foreground">{user.role}</div></div>
        </div>}
        <Link to="/cakes" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><Cake className="h-5 w-5" />Oferta tortów</Link>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><LogOut className="h-5 w-5" />Wyloguj się</button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block"><Sidebar cls="sticky top-0" /></div>
      {sideOpen && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/40" onClick={() => setSideOpen(false)} /><Sidebar cls="relative z-10" /></div>}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md lg:px-8">
          <button className="lg:hidden" onClick={() => setSideOpen(true)} aria-label="Menu"><Menu className="h-6 w-6" /></button>
          <div className="hidden lg:block"><span className="text-sm text-muted-foreground">Witaj ponownie, {user?.name || 'Użytkowniku'}</span></div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted" aria-label="Toggle theme">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
            <button onClick={handleLogout} aria-label="Wyloguj się" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <main id="main" className="flex-1 p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER + COOKIE
   ═══════════════════════════════════════════════ */
function FooterCta() {
  return (
    <section id="contact" className="py-20"><div className="container">
      <div className="relative overflow-hidden rounded-[calc(var(--radius)*2)] bg-gradient-accent p-10 text-center text-white shadow-cake md:p-16">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <h2 className="relative text-4xl font-bold md:text-5xl">Gotowi, by każde urodziny były <span className="font-caveat text-5xl md:text-6xl">wyjątkowe?</span></h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/90">Dołącz do firm, które automatyzują świętowanie w zespole z Caked.</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
          <a href="/#pricing" className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-white px-6 py-3 font-semibold text-primary hover:-translate-y-0.5 transition">Rozpocznij bezpłatny okres próbny</a>
          <a href="mailto:kontakt@caked.pl" className="inline-flex items-center gap-2 rounded-[var(--radius)] border-2 border-white/80 px-6 py-3 font-semibold text-white hover:bg-white/10 transition">Umów demo</a>
        </div>
      </div>
    </div></section>
  );
}

function Footer() {
  const cols = [
    { t: 'Produkt', links: [['Software', '/software'], ['Integracje', '/integracje'], ['Oferta tortów', '/cakes'], ['Cennik', '/#pricing'], ['FAQ', '/#faq']] },
    { t: 'Firma', links: [['O nas', '/o-nas'], ['Blog', '/blog'], ['Kontakt', '/kontakt']] },
    { t: 'Miasta', links: [['Wrocław', '/miasta/wroclaw'], ['Warszawa', '/miasta/warszawa'], ['Kraków', '/miasta/krakow'], ['Poznań', '/miasta/poznan'], ['Gdańsk', '/miasta/gdansk'], ['Katowice', '/miasta/katowice']] },
  ];
  return (
    <footer className="border-t border-border bg-card/50"><div className="container py-14">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs font-caveat text-xl text-primary">Dbamy o to, żeby w biurze było słodko.</p>
          <div className="mt-5 flex gap-3">
            {[Linkedin, Instagram, Facebook].map((Icon, i) => <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"><Icon className="h-4 w-4" /></a>)}
          </div>
          <a href="mailto:kontakt@caked.pl" className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><Mail className="h-4 w-4" /> kontakt@caked.pl</a>
        </div>
        {cols.map(col => (
          <div key={col.t}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{col.t}</h4>
            <ul className="space-y-2">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  {href.startsWith('/') && !href.startsWith('/#') ? (
                    <Link to={href} className="text-sm text-muted-foreground hover:text-primary">{label}</Link>
                  ) : (
                    <a href={href} className="text-sm text-muted-foreground hover:text-primary">{label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
        <div>© 2026 Caked. Wszelkie prawa zastrzeżone. · <a href="#" className="hover:text-primary">Prywatność</a> · <a href="#" className="hover:text-primary">Regulamin</a></div>
        <div>Zrobione z ♥ we Wrocławiu</div>
      </div>
    </div></footer>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(() => !localStorage.getItem('ck'));
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-[var(--radius)] border border-border bg-card p-5 shadow-cake md:left-auto md:right-6">
      <h4 className="mb-1 font-semibold">Szanujemy Twoją prywatność</h4>
      <p className="mb-4 text-xs text-muted-foreground">Używamy plików cookie, aby ulepszyć przeglądanie i analizować ruch.</p>
      <div className="flex gap-2">
        <button onClick={() => { localStorage.setItem('ck', '1'); setShow(false); }} className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Akceptuj</button>
        <button onClick={() => { localStorage.setItem('ck', '0'); setShow(false); }} className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold">Odrzuć</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: ACCORDION
   ═══════════════════════════════════════════════ */
function Accordion({ items, allowMultiple = false }) {
  const [open, setOpen] = useState([]);
  const toggle = (i) => {
    setOpen(prev => {
      if (prev.includes(i)) return prev.filter(x => x !== i);
      return allowMultiple ? [...prev, i] : [i];
    });
  };
  return (
    <div className="divide-y divide-border rounded-[var(--radius)] border border-border bg-card shadow-glass">
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={i} className="group">
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-muted/30 transition"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold">{item.q}</span>
              <ChevronDown className={`h-5 w-5 flex-shrink-0 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: MARQUEE / LOGO TICKER
   ═══════════════════════════════════════════════ */
function Marquee({ items, speed = 30 }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => <div key={i} className="flex-shrink-0 text-5xl font-caveat text-primary/60 md:text-6xl">{item}</div>)}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } @media (prefers-reduced-motion: reduce) { [style*="marquee"] { animation: none !important; } }`}</style>
    </div>
  );
}

const CLIENT_LOGOS = ['Allegro', 'CD Projekt', 'InPost', 'mBank', 'Booksy', 'Żabka', 'Brainly', 'Tidio', 'DocPlanner'];

function LogoTicker({ label = 'Zaufali nam' }) {
  const doubled = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <section className="py-14 border-y border-border bg-card/30">
      <div className="container">
        <p className="mb-6 text-center text-sm uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="relative overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap" style={{ animation: 'logos 40s linear infinite' }}>
            {doubled.map((name, i) => (
              <div key={i} className="flex-shrink-0 text-xl font-bold text-foreground/40 hover:text-primary transition">{name}</div>
            ))}
          </div>
          <style>{`@keyframes logos { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: HRIS TICKER
   ═══════════════════════════════════════════════ */
const HRIS_LOGOS = ['BambooHR', 'HiBob', 'Personio', 'enova365', 'Comarch', 'Workday', 'ADP', 'Gusto', 'Rippling', 'Namely', 'UKG', 'Simployer'];

function HrisTicker() {
  const doubled = [...HRIS_LOGOS, ...HRIS_LOGOS];
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30 py-4">
      <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'hris 25s linear infinite' }}>
        {doubled.map((n, i) => <div key={i} className="flex-shrink-0 rounded-lg bg-background border border-border px-4 py-2 text-sm font-semibold text-foreground/70">{n}</div>)}
      </div>
      <style>{`@keyframes hris { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: NEWS CAROUSEL
   ═══════════════════════════════════════════════ */
const NEWS_ITEMS = [
  { date: '16 stycznia 2026', read: '2 min', title: 'Jak działy HR oszczędzają godziny miesięcznie', excerpt: 'Konkretne case studies z firm, które wdrożyły Caked.', gr: 'from-primary to-accent' },
  { date: '13 stycznia 2026', read: '4 min', title: 'Kolejne miasta na mapie: Katowice, Łódź, Gdynia', excerpt: 'Plan ekspansji Caked na 2026 rok. Zaczynamy od południa Polski.', gr: 'from-accent to-accent2' },
  { date: '6 stycznia 2026', read: '3 min', title: 'Poznaj zespół Caked Wrocław', excerpt: 'Kto stoi za tortami w naszym flagowym mieście? Rozmowa z ekipą.', gr: 'from-success to-primary' },
];

function NewsCarousel() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx(p => (p + 1) % NEWS_ITEMS.length);
  const prev = () => setIdx(p => (p - 1 + NEWS_ITEMS.length) % NEWS_ITEMS.length);
  return (
    <section className="section">
      <div className="container">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="tagline mb-2">Wiadomości</span>
            <h2 className="text-3xl font-bold md:text-4xl">News & Insights</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button onClick={prev} aria-label="Poprzedni" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary transition"><ArrowLeft className="h-4 w-4" /></button>
            <button onClick={next} aria-label="Następny" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:border-primary hover:text-primary transition"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {NEWS_ITEMS.map((item, i) => (
            <article key={item.title} className={`card-surface overflow-hidden group ${i === idx ? 'md:col-span-1' : 'hidden md:block'}`}>
              <div className={`flex h-40 items-center justify-center bg-gradient-to-br ${item.gr}`}>
                <span className="text-4xl opacity-60">📰</span>
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{item.date}</span><span>·</span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.read}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: PRESS QUOTE
   ═══════════════════════════════════════════════ */
function PressQuote() {
  return (
    <section className="py-14">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto h-10 w-10 text-primary/40" />
          <p className="mt-4 text-2xl font-caveat text-foreground md:text-3xl">„Caked z trzycyfrowym wzrostem — inwestorzy ustawiają się w kolejce."</p>
          <p className="mt-4 text-sm text-muted-foreground">2025 · Puls Biznesu</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: FOUNDER LETTER
   ═══════════════════════════════════════════════ */
function FounderLetter() {
  const [open, setOpen] = useState(false);
  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl card-surface p-8 md:p-12">
          <button onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between gap-4 text-left" aria-expanded={open}>
            <div>
              <span className="tagline mb-2">List od założycieli</span>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">{open ? 'Zamknij' : 'Otwórz'} wiadomość od założycieli</h2>
            </div>
            <ChevronDown className={`h-6 w-6 flex-shrink-0 text-primary transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="mt-8 space-y-4 text-foreground/90 leading-relaxed">
              <p>Caked zaczęło się we Wrocławiu od jednego pytania: czy świętowanie urodzin w pracy da się zrobić bez wysiłku, sprawiedliwie i naprawdę przyjemnie?</p>
              <p>Widzieliśmy setki arkuszy kalkulacyjnych z datami urodzin, przypomnień ustawianych w telefonach i paniki w ostatniej chwili. Widzieliśmy też pracowników, którzy czuli się niedoceniani — bo HR zapomniał, albo tort był „przypadkowy".</p>
              <p>Zbudowaliśmy Caked, żeby to zmienić. Łączymy nowoczesne oprogramowanie z sieciami lokalnych cukierni. Torty są świeże, dostarczane na czas, a zespół HR nie musi pamiętać o niczym.</p>
              <p className="font-caveat text-2xl text-primary">Gotowi, żeby komuś uprzyjemnić dzień?</p>
              <p className="text-sm text-muted-foreground">— Maurycy i zespół Caked</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SHARED: FAQ DATA + SECTION
   ═══════════════════════════════════════════════ */
const FAQ_ITEMS = [
  { q: 'Jak działa Caked?', a: 'Caked automatyzuje dostawy tortów urodzinowych dla Twoich pracowników. Wgrywasz listę pracowników, konfigurujesz preferencje raz — my pilnujemy kalendarza, zamawiamy torty i koordynujemy dostawę z lokalnymi cukierniami.' },
  { q: 'Ile czasu zajmuje konfiguracja?', a: 'Większość firm kończy konfigurację w mniej niż 10 minut. Import CSV umożliwia szybkie dodanie dużych list pracowników, a integracje z systemami HR (BambooHR, Personio, HiBob) synchronizują dane automatycznie.' },
  { q: 'Ile to kosztuje?', a: 'Plany zaczynają się od 179 PLN miesięcznie dla firm 5–10 osób. Pierwsza dostawa jest GRATIS dla wszystkich nowych firm. Subskrypcja elastyczna — anuluj w dowolnym momencie z 14-dniowym wypowiedzeniem.' },
  { q: 'Gdzie dostarczacie torty?', a: 'Obecnie obsługujemy Wrocław, Warszawę, Kraków, Poznań, Gdańsk i Katowice. Wkrótce Łódź, Lublin i Szczecin. Dostawy realizują lokalne cukiernie partnerskie w godzinach pracy biura.' },
  { q: 'Czy obsługujecie diety specjalne?', a: 'Tak! Wegańskie, bezglutenowe, bez orzechów, cukrzycowe — wskazujesz preferencje każdego pracownika w panelu, a my dobieramy tort odpowiedni do jego diety.' },
  { q: 'Jak jest z ochroną danych (RODO)?', a: 'Jesteśmy w pełni zgodni z RODO. Dane są szyfrowane i przechowywane na serwerach w UE. Udostępniamy cukierniom jedynie niezbędne minimum (imię, adres dostawy) do realizacji zamówienia. W panelu możesz w każdej chwili wyeksportować lub usunąć dane.' },
  { q: 'Czy mogę anulować subskrypcję?', a: 'Tak, możesz anulować w dowolnym momencie z 14-dniowym pisemnym wypowiedzeniem przed kolejnym okresem rozliczeniowym. Bez długoterminowych umów i opłat anulacyjnych.' },
];

function FAQSection() {
  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="tagline mb-4">FAQ</span>
          <h2 className="text-4xl font-bold md:text-5xl">Najczęściej zadawane pytania</h2>
          <p className="mt-4 text-lg text-muted-foreground">Wszystko, co musisz wiedzieć o Caked i naszej usłudze.</p>
        </div>
        <div className="mx-auto max-w-3xl"><Accordion items={FAQ_ITEMS} /></div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   LANDING PAGE — ALL SECTIONS
   ═══════════════════════════════════════════════ */
function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-16 md:pt-24">
      <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gradient-frosting opacity-30 blur-3xl" />
      <div className="absolute -left-32 top-40 h-[380px] w-[380px] rounded-full bg-accent2/30 blur-3xl" />
      {/* Subtle marquee of cities in background */}
      <div className="absolute inset-x-0 top-0 opacity-[0.04] pointer-events-none select-none">
        <Marquee items={['Wrocław', 'Warszawa', 'Kraków', 'Poznań', 'Gdańsk', 'Katowice']} speed={40} />
      </div>
      <div className="container relative grid items-center gap-12 pb-20 md:pb-28 lg:grid-cols-2">
        <div className="animate-fade-up">
          <span className="tagline mb-6"><Sparkles className="mr-1.5 inline h-3.5 w-3.5" /> Platforma Caked dla nowoczesnych firm</span>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Każdy pracownik zasługuje na bycie{' '}
            <span className="font-caveat text-primary text-6xl md:text-7xl lg:text-[5.5rem]">celebrowanym</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">Automatyczne dostawy tortów prosto do biura — bez stresu, bez arkuszy, bez zapomnianych urodzin.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#pricing" className="btn-primary">Rozpocznij świętowanie <ArrowRight className="h-4 w-4" /></a>
            <a href="#contact" className="btn-outline">Poproś o wycenę</a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Zgodność z RODO</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> 6 miast w Polsce</div>
            <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /> Lokalne cukiernie</div>
          </div>
        </div>
        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] max-w-md">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-cake shadow-cake" />
            <div className="absolute inset-4 rounded-[1.7rem] bg-background/95 p-6 shadow-glass backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2"><Cake className="h-5 w-5 text-primary" /><span className="font-semibold">Nadchodzące urodziny</span></div>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">Aktywne</span>
              </div>
              <div className="space-y-3">
                {[{ n:'Anna Kowalska',d:'Dziś',dept:'Marketing',c:'bg-accent' },{ n:'Piotr Nowak',d:'12 kwi',dept:'Engineering',c:'bg-accent2' },{ n:'Magda W.',d:'18 kwi',dept:'HR',c:'bg-primary' },{ n:'Tomasz L.',d:'24 kwi',dept:'Sales',c:'bg-gold' }].map(p => (
                  <div key={p.n} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-full ${p.c} text-white font-semibold`}>{p.n[0]}</div>
                    <div className="flex-1"><div className="text-sm font-semibold">{p.n}</div><div className="text-xs text-muted-foreground">{p.dept}</div></div>
                    <span className="text-xs font-medium text-primary">{p.d}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-gradient-accent p-3 text-center text-sm font-medium text-white">100% dostaw na czas</div>
            </div>
          </div>
          <div className="absolute -left-6 top-10 hidden rounded-2xl border border-border bg-card p-4 shadow-glass animate-float md:block">
            <div className="flex items-center gap-3"><Shield className="h-6 w-6 text-success" /><div><div className="text-sm font-semibold">Zgodność z RODO</div><div className="text-xs text-muted-foreground">Twoje dane są bezpieczne</div></div></div>
          </div>
          <div className="absolute -right-4 bottom-16 hidden rounded-2xl border border-border bg-card p-4 shadow-glass animate-float md:block" style={{ animationDelay:'1s' }}>
            <div className="flex items-center gap-3"><Gift className="h-6 w-6 text-accent" /><div><div className="text-sm font-semibold">Pierwsza dostawa gratis</div><div className="text-xs text-muted-foreground">Wypróbuj bez ryzyka</div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="section"><div className="container"><div className="grid gap-6 grid-cols-2 md:grid-cols-4">
      {[{ icon: MapPin, target:6, s:'', l:'Miasta' },{ icon: Store, target:12, s:'', l:'Partnerskie cukiernie' },{ icon: Cake, target:30, s:'+', l:'Rodzajów ciast' },{ icon: Sparkles, target:100, s:'%', l:'Zawsze świeże' }].map(s => (
        <div key={s.l} className="card-surface text-center"><s.icon className="mx-auto mb-3 h-8 w-8 text-primary" /><div className="text-4xl font-bold text-primary"><AnimatedNum target={s.target} suffix={s.s} /></div><div className="mt-1 text-sm text-muted-foreground">{s.l}</div></div>
      ))}
    </div></div></section>
  );
}

function Experience() {
  return (
    <section className="section bg-card/50"><div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="tagline mb-4">Doświadczenie Caked</span>
        <h2 className="text-4xl font-bold md:text-5xl">Nigdy nie było łatwiej <span className="font-caveat text-primary text-5xl md:text-6xl">świętować z zespołem</span></h2>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="card-surface"><Calendar className="mb-4 h-10 w-10 text-primary" /><h3 className="mb-2 text-xl font-semibold">Pilnujemy kalendarza za Ciebie</h3><p className="text-muted-foreground">Pilnujemy dat urodzin i przypominamy o każdej okazji do świętowania.</p></div>
        <div className="card-surface"><Bell className="mb-4 h-10 w-10 text-accent" /><h3 className="mb-2 text-xl font-semibold">Przypomnimy Ci w porę</h3><p className="text-muted-foreground">Powiadomimy Cię z wyprzedzeniem — dwa tygodnie, tydzień i dzień przed urodzinami.</p></div>
      </div>
      <p className="mx-auto mt-12 max-w-2xl text-center font-caveat text-3xl text-primary md:text-4xl">„Bo miłe gesty budują zespół. A zapomniane urodziny — psują atmosferę."</p>
    </div></section>
  );
}

function Simplicity() {
  const steps = [{ n:'01',t:'Dodaj swój zespół',d:'Wgraj listę pracowników lub połącz system HR. Bezpiecznie przechowujemy daty i preferencje.',i:Users },{ n:'02',t:'Ustaw zasady',d:'Wybierz rozmiar tortu, wiadomość i sposób dostawy. Zrób to raz — działa zawsze.',i:Settings },{ n:'03',t:'My zajmujemy się resztą',d:'Przypomnienia, zamówienia, koordynacja i dostawa — wszystko automatycznie.',i:Zap },{ n:'04',t:'Zespół czuje się doceniony',d:'Zadowolony zespół, zero wysiłku po Twojej stronie.',i:Heart }];
  return (
    <section className="section"><div className="container">
      <div className="mx-auto mb-14 max-w-2xl text-center"><span className="tagline mb-4">Prostota</span><h2 className="text-4xl font-bold md:text-5xl">Jak zacząć — cztery proste kroki</h2><p className="mt-4 text-lg text-muted-foreground">Minimum wysiłku, maksimum efektu.</p></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{steps.map(s => <div key={s.n} className="card-surface relative"><div className="absolute right-5 top-5 font-caveat text-5xl text-primary/20">{s.n}</div><s.i className="mb-4 h-10 w-10 text-primary" /><h3 className="mb-2 text-lg font-semibold">{s.t}</h3><p className="text-sm text-muted-foreground">{s.d}</p></div>)}</div>
      <div className="mt-12 text-center"><a href="#contact" className="btn-primary">Umów Demo <ArrowRight className="h-4 w-4" /></a></div>
    </div></section>
  );
}

function PlatformSection() {
  const f = [{ t:'Ustaw raz, zapomnij na zawsze',d:'Pełna automatyzacja urodzin — od zamówienia po dostawę.',i:Zap },{ t:'Przejrzysty widok zamówień',d:'Wszystkie zamówienia w jednym miejscu z historią i statusami.',i:LayoutDashboard },{ t:'Bezpieczeństwo danych (RODO)',d:'Dane pracowników są bezpiecznie przechowywane i chronione.',i:Shield },{ t:'Prosty panel zarządzania',d:'Intuicyjny dashboard stworzony dla działów HR.',i:Settings },{ t:'Elastyczna konfiguracja',d:'Dopasuj ustawienia do potrzeb Twojego zespołu.',i:Sparkles }];
  return (
    <section className="section bg-card/50"><div className="container">
      <div className="mx-auto mb-14 max-w-2xl text-center"><span className="tagline mb-4">Platforma Caked</span><h2 className="text-4xl font-bold md:text-5xl">Wszystko w jednym miejscu</h2><p className="mt-4 text-lg text-muted-foreground">Prosty panel do zarządzania wszystkimi celebracjami w firmie.</p></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {f.map(x => <div key={x.t} className="card-surface"><div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><x.i className="h-6 w-6" /></div><h3 className="mb-2 text-lg font-semibold">{x.t}</h3><p className="text-sm text-muted-foreground">{x.d}</p></div>)}
        <div className="card-surface flex flex-col justify-center bg-gradient-accent text-white"><TrendingUp className="mb-4 h-10 w-10" /><div className="text-3xl font-bold">100% dostaw na czas</div><div className="text-white/90">Żadnych zapomnianych urodzin</div></div>
      </div>
    </div></section>
  );
}

function Options() {
  return (
    <section className="section"><div className="container space-y-16">
      <div><div className="mx-auto mb-10 max-w-2xl text-center"><h2 className="text-3xl font-bold md:text-4xl">Dopasuj do swoich potrzeb</h2><p className="mt-3 text-muted-foreground">Wybierz, które okazje chcesz świętować automatycznie.</p></div>
        <div className="flex flex-wrap justify-center gap-3">{['Okrągłe urodziny','Wszystkie urodziny','Rocznice pracy','Jubileusze i ważne rocznice','Wydarzenia firmowe'].map((c,i) => <button key={c} className="relative rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium shadow-glass transition hover:border-primary hover:text-primary">{c}{i===1 && <span className="absolute -right-2 -top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">Popularne</span>}</button>)}</div></div>
      <div><div className="mx-auto mb-8 max-w-2xl text-center"><h2 className="text-3xl font-bold md:text-4xl">Połącz z narzędziami</h2><p className="mt-3 text-muted-foreground">Działa z systemami, których już używasz.</p></div>
        <div className="flex flex-wrap items-center justify-center gap-4">{['Slack','Teams','Google','Outlook','HiBob','BambooHR'].map(t => <div key={t} className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold shadow-glass">{t}</div>)}</div></div>
    </div></section>
  );
}

function UseCases() {
  const c = [{ t:'Urodziny pracowników',d:'Automatycznie, cyklicznie, bez wysiłku',i:Cake },{ t:'Wydarzenia zespołowe',d:'Spotkania, wyjazdy, wspólne świętowanie',i:PartyPopper },{ t:'Jubileusze i rocznice',d:'Rocznice pracy, awanse',i:Award },{ t:'Premiery i sukcesy',d:'Świętuj osiągnięcia z zespołem',i:Rocket },{ t:'Okazje sezonowe',d:'Święta, imprezy końcoworoczne',i:Snowflake }];
  return (
    <section className="section bg-card/50"><div className="container">
      <div className="mx-auto mb-14 max-w-2xl text-center"><span className="tagline mb-4">Zastosowania</span><h2 className="text-4xl font-bold md:text-5xl">Jedna platforma. Każde firmowe świętowanie.</h2><p className="mt-4 text-lg text-muted-foreground">Od cyklicznych urodzin po jednorazowe wydarzenia — Caked dopasuje się do Twoich potrzeb.</p></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">{c.map(x => <div key={x.t} className="card-surface text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gradient-accent text-white shadow-glow"><x.i className="h-7 w-7" /></div><h3 className="mb-1 font-semibold">{x.t}</h3><p className="text-xs text-muted-foreground">{x.d}</p></div>)}</div>
    </div></section>
  );
}

function Comparison() {
  const pairs = [['Zapomniane urodziny i rozczarowani pracownicy','Żadnych zapomnianych urodzin — pełna automatyzacja'],['Ręczne pilnowanie dat w arkuszach','Inteligentny panel z automatycznymi przypomnieniami'],['Panika w ostatniej chwili','Wszystko zaplanowane z wyprzedzeniem'],['Przypadkowa jakość tortów','Torty premium od sprawdzonych cukierni'],['HR spędza godziny na koordynacji','Zero pracy administracyjnej']];
  return (
    <section className="section bg-card/50"><div className="container">
      <div className="mx-auto mb-14 max-w-2xl text-center"><h2 className="text-4xl font-bold md:text-5xl">Urodziny w firmie na wyższym poziomie</h2><p className="mt-4 text-lg text-muted-foreground">Zobacz, jaką różnicę robi Caked.</p></div>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="card-surface"><h3 className="mb-5 text-xl font-semibold text-muted-foreground">Bez Caked</h3><ul className="space-y-4">{pairs.map(([p]) => <li key={p} className="flex items-start gap-3"><XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" /><span className="text-sm text-muted-foreground">{p}</span></li>)}</ul></div>
        <div className="card-surface border-primary/30 bg-gradient-to-br from-card to-primary/5"><h3 className="mb-5 text-xl font-semibold text-primary">Z Caked</h3><ul className="space-y-4">{pairs.map(([,b]) => <li key={b} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" /><span className="text-sm">{b}</span></li>)}</ul></div>
      </div>
    </div></section>
  );
}

function RoiCalc() {
  const [count,setCount] = useState(50);
  const h = Math.round(count*0.75*12), amt = (h*80).toLocaleString('pl-PL');
  return (
    <section className="section"><div className="container"><div className="mx-auto max-w-3xl card-surface p-8 md:p-12">
      <div className="mb-6 text-center"><h2 className="text-3xl font-bold md:text-4xl">Kalkulator oszczędności czasu</h2><p className="mt-3 text-muted-foreground">Sprawdź, ile czasu oszczędza HR dzięki Caked.</p></div>
      <label className="mb-2 block text-sm font-medium">Liczba pracowników: <span className="text-primary">{count}</span></label>
      <input type="range" min="5" max="500" value={count} onChange={e => setCount(+e.target.value)} className="w-full accent-primary" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-primary/10 p-5 text-center"><div className="text-4xl font-bold text-primary">{h}</div><div className="text-sm text-muted-foreground">zaoszczędzonych godzin rocznie</div></div>
        <div className="rounded-xl bg-accent/10 p-5 text-center"><div className="text-4xl font-bold text-accent">{amt} PLN</div><div className="text-sm text-muted-foreground">szacunkowa wartość</div></div>
      </div>
    </div></div></section>
  );
}

function Cities() {
  return (
    <section className="section"><div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center"><span className="tagline mb-4">Obszary obsługi</span><h2 className="text-4xl font-bold md:text-5xl">Miasta, w których działamy</h2></div>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{['Wrocław','Warszawa','Kraków','Poznań','Gdańsk','Katowice'].map(c => <div key={c} className="card-surface text-center"><MapPin className="mx-auto mb-2 h-6 w-6 text-primary" /><div className="font-semibold">{c}</div><span className="mt-1 inline-block rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">Aktywne</span></div>)}</div>
    </div></section>
  );
}

function Pricing() {
  const plans = [
    { name:'Startowy',size:'5–10 pracowników',price:'179–349',f:['Do 10 tortów rocznie','Pełna automatyzacja','Panel HR','Wsparcie email'] },
    { name:'Małe biuro',size:'11–25 pracowników',price:'349–599',f:['Do 25 tortów rocznie','Pełna automatyzacja','Jedna cukiernia','Wsparcie email'] },
    { name:'Średni',size:'26–50 pracowników',price:'599–899',pop:true,f:['Do 50 tortów rocznie','Priorytetowe planowanie','Panel HR','Wsparcie telefoniczne'] },
    { name:'Rozwojowy',size:'51–100 pracowników',price:'899–1699',f:['Do 100 tortów rocznie','Torty premium','Podgląd dostaw','Wsparcie 5 dni'] },
    { name:'Enterprise',size:'101–300 pracowników',price:'1699–4899',f:['Do 300 tortów rocznie','Torty na zamówienie','Panel raportowy','Dedykowany opiekun'] },
    { name:'Indywidualny',size:'301+ pracowników',price:'x',f:['Dopasowana wycena','Dedykowana sieć cukierni','Zaawansowana analityka','Wsparcie 24/7'] },
  ];
  return (
    <section id="pricing" className="section"><div className="container">
      <div className="mx-auto mb-4 max-w-2xl text-center"><span className="tagline mb-4">Cennik</span><h2 className="text-4xl font-bold md:text-5xl">Proste plany miesięczne</h2><p className="mt-4 text-lg text-muted-foreground">Przejrzyste ceny, które rosną razem z Twoim zespołem.</p></div>
      <div className="mx-auto mb-10 max-w-2xl text-center"><div className="inline-flex items-center gap-2 rounded-full bg-gradient-accent px-5 py-2 text-sm font-semibold text-white shadow-glow"><Gift className="h-4 w-4" /> Pierwsza dostawa GRATIS dla nowych firm</div></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{plans.map(p => <div key={p.name} className={`card-surface relative flex flex-col ${p.pop?'border-primary scale-[1.02] shadow-cake':''}`}>
        {p.pop && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">Najpopularniejszy</span>}
        <h3 className="text-lg font-semibold">Plan {p.name}</h3><p className="text-sm text-muted-foreground">{p.size}</p>
        <div className="my-5"><span className="text-4xl font-bold text-primary">{p.price==='x'?'Skontaktuj się':p.price}</span>{p.price!=='x' && <span className="text-muted-foreground"> PLN / mies.</span>}</div>
        <ul className="mb-6 flex-1 space-y-2">{p.f.map(f => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />{f}</li>)}</ul>
        <button className={p.pop?'btn-primary':'btn-outline'}>Rozpocznij bezpłatny okres próbny</button>
      </div>)}</div>
      <p className="mt-8 text-center text-sm text-muted-foreground">Anuluj w dowolnym momencie z 14-dniowym wypowiedzeniem.</p>
    </div></section>
  );
}

function Testimonials() {
  const items = [{ q:'Caked całkowicie zmienił sposób, w jaki świętujemy urodziny w biurze.',n:'Anna Kowalska',r:'HR Manager, TechCorp' },{ q:'Konfiguracja zajęła 5 minut. Teraz nigdy nie przegapiamy urodzin!',n:'Piotr Nowak',r:'Dyrektor operacyjny, FinanceHub' },{ q:'Profesjonalna obsługa, piękne torty i perfekcyjny timing.',n:'Magdalena Wiśniewska',r:'CEO, Marketing Plus' },{ q:'Nasi pracownicy czują się naprawdę docenieni.',n:'Tomasz Lewandowski',r:'People & Culture Lead' }];
  return (
    <section className="section bg-card/50"><div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center"><h2 className="text-4xl font-bold md:text-5xl">Zaufane przez firmy w Polsce</h2></div>
      <div className="grid gap-6 md:grid-cols-2">{items.map(t => <div key={t.n} className="card-surface">
        <div className="mb-3 flex gap-0.5">{Array.from({length:5}).map((_,i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}</div>
        <p className="mb-5 text-foreground/90">„{t.q}"</p>
        <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-accent text-white font-semibold">{t.n[0]}</div><div><div className="text-sm font-semibold">{t.n}</div><div className="text-xs text-muted-foreground">{t.r}</div></div></div>
      </div>)}</div>
    </div></section>
  );
}

function AfterDemo() {
  const s = [{ t:'30-min rozmowa',d:'Poznajemy Twój zespół' },{ t:'Propozycja',d:'Plan dopasowany do Twoich potrzeb' },{ t:'Szybka konfiguracja',d:'CSV w 5 minut' },{ t:'Pierwsza dostawa',d:'Pierwszy tort gratis' }];
  return (
    <section className="section"><div className="container">
      <div className="mx-auto mb-14 max-w-2xl text-center"><span className="tagline mb-4">Bez zobowiązań</span><h2 className="text-4xl font-bold md:text-5xl">Co dzieje się po umówieniu demo?</h2></div>
      <div className="relative grid gap-6 md:grid-cols-4">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" />
        {s.map((x,i) => <div key={x.t} className="relative flex flex-col items-center text-center"><div className="relative z-10 grid h-16 w-16 place-items-center rounded-full bg-background border-2 border-primary text-primary text-xl font-bold shadow-glass">{i+1}</div><h3 className="mt-4 font-semibold">{x.t}</h3><p className="mt-1 text-sm text-muted-foreground">{x.d}</p></div>)}
      </div>
      <div className="mt-12 text-center"><a href="#contact" className="btn-primary">Umów bezpłatne demo <ArrowRight className="h-4 w-4" /></a></div>
    </div></section>
  );
}

function LandingPage() {
  useTitle('Caked | Automatyczne dostawy tortów dla firm');
  return (<>
    <Hero />
    <LogoTicker />
    <Stats />
    <Experience />
    <Simplicity />
    <PlatformSection />
    <Options />
    <UseCases />
    <Comparison />
    <RoiCalc />
    <Cities />
    <Pricing />
    <Testimonials />
    <NewsCarousel />
    <PressQuote />
    <FAQSection />
    <AfterDemo />
    <FooterCta />
    <Footer />
    <CookieBanner />
  </>);
}

/* ═══════════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════════ */
function DashboardPage() {
  useTitle('Panel | Caked');
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const kpis = [{ l:'Wszyscy pracownicy',v:24,i:Users,c:'text-primary' },{ l:'Najbliższe urodziny',v:3,i:Calendar,c:'text-accent' },{ l:'W tym miesiącu',v:2,i:Cake,c:'text-accent2' },{ l:'Zaplanowane dostawy',v:5,i:Truck,c:'text-success' }];
  const [done, setDone] = useState([0,1,2]);
  const toggleStep = i => setDone(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]);
  const STEPS = ['Uzupełnij profil firmy','Dodaj adres dostawy','Importuj pracowników','Wybierz cukiernię','Ustaw automatyzację','Zaproś team'];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Witaj ponownie, {user?.name || 'Użytkowniku'}</h1>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">{kpis.map(k => <div key={k.l} className="card-surface"><div className="flex items-center justify-between"><h2 className="text-sm font-medium text-muted-foreground">{k.l}</h2><k.i className={`h-5 w-5 ${k.c}`} /></div><div className="mt-2 text-3xl font-bold">{k.v}</div></div>)}</div>
      <div role="tablist" className="flex gap-1 rounded-[var(--radius)] bg-muted p-1">{['overview','employees','events','analytics'].map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} className={`flex-1 rounded-[calc(var(--radius)-4px)] px-4 py-2 text-sm font-medium transition ${tab===t?'bg-background shadow-glass':'text-muted-foreground hover:text-foreground'}`}>{({overview:'Przegląd',employees:'Pracownicy',events:'Wydarzenia',analytics:'Analityka'})[t]}</button>)}</div>
      {tab === 'overview' && <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface"><h2 className="text-lg font-semibold">Lista kontrolna</h2><div className="my-3 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{width:`${done.length/STEPS.length*100}%`}} /></div><p className="mb-4 text-xs text-muted-foreground">{done.length}/{STEPS.length}</p>
          <ul className="space-y-2">{STEPS.map((s,i) => <li key={s}><button onClick={() => toggleStep(i)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm hover:bg-muted">{done.includes(i)?<CheckCircle2 className="h-5 w-5 text-success" />:<Circle className="h-5 w-5 text-muted-foreground" />}<span className={done.includes(i)?'line-through text-muted-foreground':''}>{s}</span></button></li>)}</ul>
        </div>
        <div className="space-y-6">
          <div className="card-surface"><h2 className="mb-4 text-lg font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Najbliższe urodziny</h2>
            {[{ n:'Anna Kowalska',dept:'Marketing',d:2 },{ n:'Piotr Nowak',dept:'Engineering',d:8 },{ n:'Magda Wiśniewska',dept:'HR',d:17 }].map(b => <div key={b.n} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 mb-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white font-semibold">{b.n[0]}</div><div className="flex-1"><div className="text-sm font-semibold">{b.n}</div><div className="text-xs text-muted-foreground">{b.dept}</div></div><span className="text-xs font-medium text-primary">za {b.d} dni</span></div>)}
          </div>
          <div className="card-surface"><h2 className="mb-4 text-lg font-semibold flex items-center gap-2"><Truck className="h-5 w-5 text-success" />Najbliższe dostawy</h2>
            {[{ n:'Tort czekoladowy',to:'Anna Kowalska',st:'Zamówiony' },{ n:'Tort waniliowy',to:'Piotr Nowak',st:'W przygotowaniu' }].map(d => <div key={d.n+d.to} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 mb-3"><Cake className="h-8 w-8 text-accent" /><div className="flex-1"><div className="text-sm font-semibold">{d.n}</div><div className="text-xs text-muted-foreground">dla {d.to}</div></div><span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">{d.st}</span></div>)}
          </div>
        </div>
      </div>}
      {tab === 'employees' && <div className="card-surface"><p className="text-muted-foreground">Zarządzaj pracownikami z poziomu <Link to="/employees" className="text-primary hover:underline">strony Pracownicy</Link>.</p></div>}
      {tab === 'events' && <div className="card-surface"><h2 className="mb-4 text-lg font-semibold">Wydarzenia</h2>{[{n:'Urodziny — Anna Kowalska',d:'18 kwi'},{n:'Urodziny — Piotr Nowak',d:'24 kwi'},{n:'Rocznica — Magda W.',d:'28 kwi'}].map(e => <div key={e.n} className="flex items-center justify-between rounded-xl bg-muted/50 p-3 mb-2"><span className="text-sm font-medium">{e.n}</span><span className="text-xs text-muted-foreground">{e.d}</span></div>)}</div>}
      {tab === 'analytics' && <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">{[{l:'Torty dostarczone',v:47,i:Cake,c:'text-primary'},{l:'Pracownicy celebrowani',v:24,i:Users,c:'text-accent'},{l:'Średnia ocena',v:'4.9',i:Star,c:'text-gold'},{l:'Zaoszczędzone godziny',v:36,i:TrendingUp,c:'text-success'}].map(s => <div key={s.l} className="card-surface text-center"><s.i className={`mx-auto mb-2 h-8 w-8 ${s.c}`} /><div className="text-3xl font-bold">{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div></div>)}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EMPLOYEES PAGE
   ═══════════════════════════════════════════════ */
const INIT_EMP = [
  { id:1,name:'Anna Kowalska',dept:'Marketing',bday:'1992-04-18',st:'active' },
  { id:2,name:'Piotr Nowak',dept:'Engineering',bday:'1988-04-24',st:'active' },
  { id:3,name:'Magda Wiśniewska',dept:'HR',bday:'1995-05-03',st:'active' },
  { id:4,name:'Tomasz Lewandowski',dept:'Sales',bday:'1990-06-15',st:'active' },
  { id:5,name:'Kasia Zielińska',dept:'Finance',bday:'1993-07-22',st:'noCake' },
  { id:6,name:'Wojtek Kowal',dept:'Engineering',bday:'1991-08-10',st:'active' },
  { id:7,name:'Ola Dąbrowska',dept:'Marketing',bday:'1994-09-30',st:'active' },
  { id:8,name:'Michał Wójcik',dept:'Operacje',bday:'1989-11-12',st:'active' },
];

function EmployeesPage() {
  useTitle('Pracownicy | Caked');
  const [emps, setEmps] = useState(INIT_EMP);
  const [search, setSearch] = useState('');
  const filtered = emps.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()));
  const daysUntil = bd => { const n=new Date(), b=new Date(bd); b.setFullYear(n.getFullYear()); if(b<n) b.setFullYear(n.getFullYear()+1); return Math.ceil((b-n)/(864e5)); };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Pracownicy</h1>
        <div className="flex gap-2"><button className="btn-outline py-2 text-xs"><Upload className="h-3.5 w-3.5" /> Import CSV</button><button className="btn-primary py-2 text-xs"><Plus className="h-3.5 w-3.5" /> Dodaj</button></div>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Szukaj pracownika..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-[var(--radius)] border border-border bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none" /></div>
      <div className="overflow-x-auto rounded-[var(--radius)] border border-border bg-card shadow-glass">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50"><th className="p-4 text-left font-semibold">Imię</th><th className="p-4 text-left font-semibold">Dział</th><th className="p-4 text-left font-semibold">Urodziny</th><th className="p-4 text-center font-semibold">Nadchodzi</th><th className="p-4 text-center font-semibold">Status</th><th className="p-4 text-center font-semibold">Akcje</th></tr></thead>
          <tbody>{filtered.map(e => <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
            <td className="p-4 font-medium">{e.name}</td><td className="p-4 text-muted-foreground">{e.dept}</td>
            <td className="p-4 text-muted-foreground">{new Date(e.bday).toLocaleDateString('pl-PL')}</td>
            <td className="p-4 text-center text-xs font-medium text-primary">{daysUntil(e.bday)} dni</td>
            <td className="p-4 text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${e.st==='active'?'bg-success/15 text-success':'bg-muted text-muted-foreground'}`}>{e.st==='active'?'Aktywny':'Bez tortu'}</span></td>
            <td className="p-4 text-center"><div className="inline-flex gap-1"><button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted" aria-label={`Edytuj ${e.name}`}><Pencil className="h-4 w-4 text-muted-foreground" /></button><button onClick={() => setEmps(p => p.filter(x => x.id !== e.id))} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-destructive/10" aria-label={`Usuń ${e.name}`}><Trash2 className="h-4 w-4 text-destructive" /></button></div></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SETTINGS PAGE
   ═══════════════════════════════════════════════ */
function SettingsPage() {
  useTitle('Ustawienia firmy | Caked');
  const [auto, setAuto] = useState(true);
  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Ustawienia firmy</h1>
      <section className="card-surface space-y-4"><h2 className="text-lg font-semibold">Adres firmy</h2><p className="text-sm text-muted-foreground">Adres dostawy tortów urodzinowych</p>
        <div className="grid gap-4 md:grid-cols-3">{[{l:'Ulica',v:'ul. Świdnicka 12'},{l:'Miasto',v:'Wrocław'},{l:'Kod',v:'50-066'}].map(f => <div key={f.l}><label className="mb-1 block text-sm font-medium">{f.l}</label><input defaultValue={f.v} className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" /></div>)}</div>
        <button className="btn-primary py-2 text-sm"><Save className="h-4 w-4" /> Zapisz</button>
      </section>
      <section className="card-surface"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Automatyzacja urodzin</h2><p className="text-sm text-muted-foreground">Automatyczne zamawianie tortów na urodziny.</p></div>
        <button onClick={() => setAuto(!auto)} className={`relative h-7 w-12 rounded-full transition ${auto?'bg-primary':'bg-muted'}`} role="switch" aria-checked={auto}><span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${auto?'left-[calc(100%-1.625rem)]':'left-0.5'}`} /></button>
      </div><p className="mt-3 text-sm font-medium text-primary">{auto?'Automatyzacja włączona':'Automatyzacja wyłączona'}</p></section>
      <section className="card-surface space-y-4"><h2 className="text-lg font-semibold">Integracje</h2>
        {[{n:'Email',d:'Powiadomienia na email',i:Mail,on:true},{n:'Slack',d:'Przypomnienia na Slack',i:MessageSquare,on:false},{n:'Zapier',d:'Automatyzacja workflow',i:Zap,on:false},{n:'MS Teams',d:'Powiadomienia w Teams',i:MonitorSmartphone,on:false}].map(x => <div key={x.n} className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
          <div className="flex items-center gap-3"><x.i className="h-5 w-5 text-primary" /><div><div className="text-sm font-semibold">{x.n}</div><div className="text-xs text-muted-foreground">{x.d}</div></div></div>
          <div className="flex items-center gap-3"><span className={`text-xs font-medium ${x.on?'text-success':'text-muted-foreground'}`}>{x.on?'Połączony':'Niepołączony'}</span><button className={x.on?'btn-outline py-1.5 text-xs':'btn-primary py-1.5 text-xs'}>{x.on?'Rozłącz':'Połącz'}</button></div>
        </div>)}</section>
      <section className="card-surface"><div className="flex items-center gap-3 mb-4"><Shield className="h-6 w-6 text-primary" /><div><h2 className="text-lg font-semibold">Zarządzanie danymi (RODO)</h2><p className="text-sm text-muted-foreground">Eksportuj lub usuń dane pracowników.</p></div></div>
        <div className="flex flex-wrap gap-3"><button className="btn-outline py-2 text-sm">Eksportuj JSON</button><button className="inline-flex items-center gap-2 rounded-[var(--radius)] border-2 border-destructive bg-transparent px-6 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-white transition">Usuń dane</button></div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CAKES PAGE
   ═══════════════════════════════════════════════ */
// ─── Pricing floor ────────────────────────────────────────
// Minimalna cena za tort (PLN). Żadna cena tortu w UI nie może być niższa.
const MIN_CAKE_PRICE = 50;

// Parsuje string ceny ("149 PLN") lub liczbę, aplikuje floor i zwraca sformatowany string.
function cakePrice(raw) {
  const num = typeof raw === 'number' ? raw : parseInt(String(raw).replace(/\D/g, ''), 10);
  const safe = Math.max(MIN_CAKE_PRICE, Number.isFinite(num) ? num : MIN_CAKE_PRICE);
  return `${safe} PLN`;
}

const CAKES_DATA = [
  { name:'Tort czekoladowy',bakery:'Cukiernia Sowa',price:'149 PLN',gr:'from-amber-800 to-amber-600' },
  { name:'Sernik nowojorski',bakery:'Seromania',price:'129 PLN',gr:'from-yellow-300 to-orange-300' },
  { name:'Tort Red Velvet',bakery:'Cukiernia Sowa',price:'169 PLN',gr:'from-red-500 to-red-700' },
  { name:'Tort owocowy premium',bakery:'Sweet Corner',price:'189 PLN',gr:'from-green-400 to-emerald-600' },
  { name:'Tort waniliowy z malinami',bakery:'La Patisserie',price:'159 PLN',gr:'from-pink-300 to-rose-500' },
  { name:'Tort bezglutenowy',bakery:'Bio Cukiernia',price:'179 PLN',gr:'from-lime-400 to-green-500' },
];

function CakesPage() {
  useTitle('Nasze torty | Caked');
  const [city, setCity] = useState('Wrocław');
  return (<>
    <section className="section"><div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center"><h1 className="text-4xl font-bold md:text-5xl">Nasze torty urodzinowe</h1><p className="mt-4 text-lg text-muted-foreground">Premium torty celebracyjne dla firm</p></div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">{['Wrocław','Warszawa','Kraków','Poznań','Gdańsk','Katowice'].map(c => <button key={c} onClick={() => setCity(c)} className={`rounded-full px-5 py-2 text-sm font-medium transition ${city===c?'bg-primary text-primary-foreground shadow-glow':'border border-border bg-card hover:border-primary hover:text-primary'}`}>{c}</button>)}</div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{CAKES_DATA.map(cake => <div key={cake.name} className="card-surface overflow-hidden"><div className={`flex h-48 items-center justify-center rounded-t-[calc(var(--radius)-1px)] bg-gradient-to-br ${cake.gr}`}><span className="text-5xl">🎂</span></div><div className="p-5"><h3 className="text-lg font-semibold">{cake.name}</h3><p className="text-sm text-muted-foreground">{cake.bakery}</p><div className="mt-3 flex items-center justify-between"><span className="text-xl font-bold text-primary">{cakePrice(cake.price)}</span><button className="btn-primary py-1.5 text-xs">Zamów</button></div></div></div>)}</div>
    </div></section>
    <Footer />
  </>);
}

/* ═══════════════════════════════════════════════
   BLOG PAGE
   ═══════════════════════════════════════════════ */
const ARTICLES = [
  { id:1,title:'Jak automatyzować urodziny w firmie?',cat:'HR',time:5,gr:'from-primary to-accent' },
  { id:2,title:'5 pomysłów na tort do biura',cat:'Porady',time:4,gr:'from-accent to-accent2' },
  { id:3,title:'Caked integruje się ze Slack i Teams',cat:'Produkt',time:3,gr:'from-success to-primary' },
  { id:4,title:'Dlaczego celebrowanie zwiększa retencję?',cat:'HR',time:7,gr:'from-gold to-accent2' },
  { id:5,title:'Caked wchodzi do Katowic!',cat:'Aktualności',time:2,gr:'from-accent2 to-primary' },
  { id:6,title:'Poradnik: tort dla zespołu z dietami',cat:'Porady',time:6,gr:'from-primary to-gold' },
];

function BlogPage() {
  useTitle('Blog | Caked');
  const cats = ['Wszystkie','HR','Porady','Aktualności','Produkt'];
  const [cat, setCat] = useState('Wszystkie');
  const filtered = cat === 'Wszystkie' ? ARTICLES : ARTICLES.filter(a => a.cat === cat);
  return (<>
    <section className="section"><div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center"><h1 className="text-4xl font-bold md:text-5xl">Blog</h1><p className="mt-4 text-lg text-muted-foreground">Porady HR, inspiracje i nowości od Caked.</p></div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2 text-sm font-medium transition ${cat===c?'bg-primary text-primary-foreground shadow-glow':'border border-border bg-card hover:border-primary hover:text-primary'}`}>{c}</button>)}</div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map(a => <article key={a.id} className="card-surface overflow-hidden group">
        <div className={`flex h-44 items-center justify-center bg-gradient-to-br ${a.gr}`}><span className="text-4xl opacity-50 group-hover:scale-110 transition">📝</span></div>
        <div className="p-5"><span className="tagline text-[10px] mb-2">{a.cat}</span><h2 className="mt-2 text-lg font-semibold leading-tight group-hover:text-primary transition">{a.title}</h2><div className="mt-4 flex items-center justify-between"><span className="text-xs text-muted-foreground"><Clock className="inline h-3.5 w-3.5" /> {a.time} min</span><button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">Czytaj <ArrowRight className="h-3.5 w-3.5" /></button></div></div>
      </article>)}</div>
    </div></section>
    <Footer />
  </>);
}

/* ═══════════════════════════════════════════════
   ABOUT PAGE (/o-nas)
   ═══════════════════════════════════════════════ */
const TEAM = [
  { name: 'Maurycy Woźnica', role: 'CEO', bio: 'Pomysłodawca Caked. Zanim zbudował platformę, przez 10 lat prowadził działy operacyjne w firmach technologicznych — widział setki arkuszy z urodzinami pracowników.', c: 'bg-primary' },
  { name: 'Anna Konieczna', role: 'CTO', bio: 'Inżynierka z 12-letnim stażem. Wcześniej tech lead w Allegro i Tidio. Pilnuje, żeby platforma była szybka, bezpieczna i skalowała do tysięcy pracowników.', c: 'bg-accent' },
  { name: 'Piotr Marciniak', role: 'CCO', bio: 'Szef sprzedaży i obsługi klienta. Zbudował relacje z każdą cukiernią partnerską. Dba, żeby HR-y nigdy nie zostały same z problemem.', c: 'bg-accent2' },
  { name: 'Katarzyna Michalska', role: 'Head of Bakery Ops', bio: 'Koordynuje sieć cukierni w 6 miastach. Cukierniczka z wykształcenia — zna branżę od kuchni (dosłownie).', c: 'bg-gold' },
];

const TIMELINE = [
  { date: 'Marzec 2024', title: 'Początki — od pomysłu do pierwszego tortu', desc: 'Caked powstał w małym biurze we Wrocławiu. Pierwszym klientem była wrocławska firma 20-osobowa. Tort dostarczony z Cukierni Sowa, pracownicy zachwyceni.' },
  { date: 'Czerwiec 2024', title: 'Pierwsi partnerzy cukierniczy', desc: 'Nawiązaliśmy współpracę z 4 lokalnymi cukierniami we Wrocławiu. Każda z nich została zaproszona do pilotażu — testowaliśmy logistykę, jakość, czasy dostaw.' },
  { date: 'Wrzesień 2024', title: 'Ekspansja — Warszawa i Kraków', desc: 'Po 6 miesiącach w rodzimym Wrocławiu ruszyliśmy z usługą w Warszawie i Krakowie. 100-tny klient podpisany w grudniu.' },
  { date: 'Luty 2025', title: 'Integracje z systemami HR', desc: 'Uruchamiamy integracje z BambooHR, Personio, enova365 i Comarch. Firmy mogą synchronizować dane pracowników jednym kliknięciem.' },
  { date: 'Październik 2025', title: 'Gdańsk, Poznań i runda inwestycyjna', desc: 'Dołączają kolejne dwa miasta. Zamykamy rundę seed z funduszem VC z Warszawy. Zespół rośnie do 12 osób.' },
  { date: 'Marzec 2026', title: 'Katowice + roadmap na kolejne miasta', desc: 'Start w Katowicach. Ogłaszamy plan wejścia do Łodzi, Lublina i Szczecina do końca 2026 roku.' },
];

function AboutPage() {
  useTitle('O nas | Caked');
  return (<>
    <section className="section">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="tagline mb-4">Zespół za tortami</span>
          <h1 className="text-5xl font-bold md:text-6xl">O <span className="font-caveat text-primary text-6xl md:text-7xl">Caked</span></h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Caked zaczęło się we Wrocławiu od jednego pytania: czy świętowanie urodzin w pracy da się zrobić bez wysiłku, sprawiedliwie i naprawdę przyjemnie? Łącząc tradycyjne cukiernictwo z nowoczesnym oprogramowaniem, zyskaliśmy zaufanie pierwszych klientów i uwagę lokalnych mediów. Dzisiaj działamy w 6 miastach Polski, współpracujemy z kilkunastoma cukierniami partnerskimi i obsługujemy ponad 250 firm. Naszą misją jest, żeby żaden pracownik nie został zapomniany — a każde urodziny były wyjątkowe.
          </p>
        </div>
      </div>
    </section>

    <FounderLetter />

    {/* Team */}
    <section className="section bg-card/50">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="tagline mb-4">Zespół</span>
          <h2 className="text-4xl font-bold md:text-5xl">Ludzie za kulisami</h2>
          <p className="mt-4 text-lg text-muted-foreground">Pasja to nasza waluta.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TEAM.map(p => (
            <div key={p.name} className="card-surface text-center">
              <div className={`mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full ${p.c} text-white text-3xl font-bold`}>{p.name[0]}</div>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">{p.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{p.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="tagline mb-4">Kalendarium</span>
          <h2 className="text-4xl font-bold md:text-5xl">Nasza droga</h2>
          <p className="mt-4 text-lg text-muted-foreground">Od pierwszego tortu do 6 miast w Polsce.</p>
        </div>
        <div className="mx-auto max-w-3xl relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-accent/40 to-transparent" />
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <div key={t.date} className="relative pl-14">
                <div className={`absolute left-0 grid h-8 w-8 place-items-center rounded-full text-white text-xs font-bold ${i % 2 === 0 ? 'bg-primary' : 'bg-accent'}`}>{i + 1}</div>
                <div className="card-surface">
                  <div className="text-xs font-medium uppercase tracking-wider text-primary">{t.date}</div>
                  <h3 className="mt-1 text-lg font-semibold">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <PressQuote />
    <FooterCta />
    <Footer />
  </>);
}

/* ═══════════════════════════════════════════════
   SOFTWARE PAGE (/software)
   ═══════════════════════════════════════════════ */
const SW_FEATURES = [
  { tag: 'Wdrożenie', title: 'Onboarding', desc: 'Jednym kliknięciem wgrywasz całą listę pracowników. Kolejne dwa kliknięcia — i masz skonfigurowany adres dostawy, preferencje i reguły. Oficjalnie jesteś gotowy na tort.', slogan: 'Ustaw raz. Zapomnij na zawsze.', icon: Upload },
  { tag: 'Reguły', title: 'Twoje zasady', desc: 'Pomyśl o Caked jak o sklepie z aplikacjami, ale dla dni wyjątkowych. Wszystkie urodziny, tylko okrągłe, konkretne biura, konkretne torty — Ty decydujesz.', slogan: 'Wszystko działa automatycznie.', icon: Settings },
  { tag: 'Czasem po prostu chce się tortu', title: 'Okazje specjalne', desc: 'Kto lubi sztywne zasady? Chcesz tortu „ot tak" — dostaniesz. Dodaj jednorazowe wydarzenie w panelu i cukiernia już wie co piec.', slogan: 'Bo niecodzienne urodziny się zdarzają.', icon: PartyPopper },
  { tag: 'Tracking', title: 'Zarządzanie zamówieniami', desc: 'Przejrzysty widok każdej nadchodzącej celebracji — dla kogo, kiedy, co się dzieje. A jeśli ktoś źle się sprawował w pracy, zawsze możesz wyłączyć dostawę jednym kliknięciem ;)', slogan: 'Pełna kontrola, zero stresu.', icon: LayoutDashboard },
];

function SoftwarePage() {
  useTitle('Software | Caked');
  return (<>
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="tagline mb-4">Platforma</span>
          <h1 className="text-5xl font-bold md:text-6xl">Tu dzieje się <span className="font-caveat text-primary text-6xl md:text-7xl">magia</span></h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Caked łączy onboarding, reguły, okazje specjalne i dostawy w jeden płynny proces. Nigdy więcej nie zapomnisz ważnego dnia — i nigdy nie będziesz musiał go pamiętać.
          </p>
          <p className="mt-4 font-caveat text-2xl text-primary md:text-3xl">Urodziny — obsłużone. Dni — stworzone.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/kontakt" className="btn-primary">Umów demo <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/login" className="btn-outline">Zaloguj się</Link>
          </div>
        </div>
      </div>
    </section>

    {/* Feature blocks — alternating */}
    <section className="space-y-20 pb-20">
      <div className="container space-y-20">
        {SW_FEATURES.map((f, i) => {
          const Icon = f.icon;
          const reverse = i % 2 === 1;
          return (
            <div key={f.title} className={`grid items-center gap-12 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <span className="tagline mb-4">{f.tag}</span>
                <h2 className="text-3xl font-bold md:text-4xl">{f.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{f.desc}</p>
                <p className="mt-6 font-caveat text-2xl text-primary md:text-3xl">{f.slogan}</p>
              </div>
              <div className="relative">
                <div className={`aspect-[4/3] rounded-[2rem] bg-gradient-cake shadow-cake relative overflow-hidden ${reverse ? '' : ''}`}>
                  <div className="absolute inset-4 rounded-[1.7rem] bg-background/95 p-8 shadow-glass flex items-center justify-center">
                    <Icon className="h-24 w-24 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>

    {/* Single review card */}
    <section className="section bg-card/50">
      <div className="container">
        <div className="mx-auto max-w-2xl card-surface p-10 text-center">
          <Quote className="mx-auto h-10 w-10 text-primary/40" />
          <p className="mt-6 text-xl leading-relaxed">„Konfiguracja w 5 minut, a my zapomnieliśmy o problemie na zawsze. Nasi pracownicy po raz pierwszy czują się celebrowani."</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-accent text-white text-lg font-bold">A</div>
            <div className="text-left"><div className="font-semibold">Anna Kowalska</div><div className="text-xs text-muted-foreground">HR Manager, TechCorp Wrocław</div></div>
          </div>
        </div>
      </div>
    </section>

    <FooterCta />
    <Footer />
  </>);
}

/* ═══════════════════════════════════════════════
   INTEGRATIONS PAGE (/integracje)
   ═══════════════════════════════════════════════ */
const INTEGRATIONS_FULL = [
  'BambooHR', 'HiBob', 'Personio', 'enova365', 'Comarch HR', 'Workday', 'ADP', 'Gusto', 'Rippling', 'Namely',
  'UKG', 'Simployer', 'Sage HR', 'Zoho People', 'Deel', 'Remote.com', 'Factorial', 'Kenjo', 'Freshteam', 'Paylocity',
  'Paycom', 'TriNet', 'Justworks', 'Paychex', 'Bizneo HR', 'Charlie HR', 'Breathe HR', 'CakeHR', 'OrangeHRM', 'Workable',
  'Greenhouse', 'Lever', 'Teamtailor', 'JazzHR', 'Humaans', 'Lattice', '15Five', 'Culture Amp', 'Officevibe', 'Leapsome',
  'Slack', 'Microsoft Teams', 'Google Workspace', 'Outlook 365', 'Zoom', 'Notion', 'Asana', 'Linear', 'Jira', 'ClickUp',
  'Okta', 'Auth0', 'JumpCloud', 'OneLogin', 'Azure AD', 'Google Identity', 'Keycloak', 'LastPass', '1Password',
  'HubSpot', 'Salesforce', 'Pipedrive', 'Zapier', 'Make', 'n8n', 'IFTTT', 'Webhooks',
  'Płatnik', 'Symfonia Kadry i Płace', 'Sage 50c', 'Optima ERP', 'Asseco HR', 'ClickMeeting', 'Brainhub HR',
  'Finom', 'Tpay', 'Przelewy24', 'Autopay', 'Fakturownia', 'Infakt', 'wFirma', 'iFirma',
];

function IntegrationsPage() {
  useTitle('Integracje | Caked');
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? INTEGRATIONS_FULL : INTEGRATIONS_FULL.slice(0, 20);

  return (<>
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="tagline mb-4">HRIS i synchronizacja danych</span>
          <h1 className="text-5xl font-bold md:text-6xl">Wszyscy pracownicy <span className="font-caveat text-primary text-6xl md:text-7xl">zawsze aktualni</span></h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Zbudowane tak, żeby działało z narzędziami, których już używasz. Caked integruje się z {INTEGRATIONS_FULL.length}+ systemami HR, żeby dane pracowników były zawsze świeże, bezpieczne i zsynchronizowane — bez dodatkowej pracy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/kontakt" className="btn-primary">Umów demo <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>

    {/* 3 Pillars */}
    <section className="section bg-card/50">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Dane pracowników, zawsze zsynchronizowane</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Szybka konfiguracja', desc: 'Połącz raz, gotowe w niecałe 2 minuty. Połącz swój HRIS z Caked — dane pracowników trafiają bezpośrednio do zakładki „Pracownicy". Zero arkuszy, zero ręcznego wgrywania.', icon: Zap },
            { title: 'Niezawodność danych', desc: 'Codzienna automatyczna synchronizacja. Nowi pracownicy, odejścia, zaktualizowane adresy — wszystko synchronizuje się każdego dnia. Nigdy nie przegapisz urodzin ani nie wyślesz tortu pod zły adres.', icon: Shield },
            { title: 'Prywatność i bezpieczeństwo', desc: 'Dane pracowników pozostają w Twoim HRIS. Pobieramy wyłącznie to, co niezbędne do dostarczenia tortu. RODO-compliant, szyfrowanie end-to-end, serwery w UE.', icon: Lock },
          ].map(p => { const I = p.icon; return (
            <div key={p.title} className="card-surface">
              <I className="mb-4 h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ); })}
        </div>
      </div>
    </section>

    {/* Ecosystem grid */}
    <section className="section">
      <div className="container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="tagline mb-4">Ekosystem</span>
          <h2 className="text-4xl font-bold md:text-5xl">Kompatybilność z Twoim stack'iem</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Integrujemy się z {INTEGRATIONS_FULL.length}+ systemami HR, narzędziami komunikacji i platformami workflow. Nie ma Twojego — zgłoś, dopisujemy na bieżąco.
          </p>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map(name => (
            <div key={name} className="rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-foreground/70 hover:border-primary hover:text-primary transition">
              {name}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => setShowAll(!showAll)} className="btn-outline">
            {showAll ? `Ukryj (pokazano ${INTEGRATIONS_FULL.length})` : `Pokaż wszystkie ${INTEGRATIONS_FULL.length}`}
            <ChevronDown className={`h-4 w-4 transition ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>

    <FooterCta />
    <Footer />
  </>);
}

/* ═══════════════════════════════════════════════
   CONTACT PAGE (/kontakt)
   ═══════════════════════════════════════════════ */
const OFFICES = [
  { city: 'Wrocław', addr: 'ul. Świdnicka 12, 50-066 Wrocław', phone: '+48 71 000 00 00', email: 'wroclaw@caked.pl', main: true },
  { city: 'Warszawa', addr: 'ul. Marszałkowska 100, 00-001 Warszawa', phone: '+48 22 000 00 00', email: 'warszawa@caked.pl' },
];

function ContactPage() {
  useTitle('Kontakt | Caked');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.email.includes('@')) { setError('Podaj prawidłowy email.'); return; }
    if (form.message.length < 10) { setError('Wiadomość musi mieć przynajmniej 10 znaków.'); return; }
    setSent(true);
  };

  return (<>
    <section className="section">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="tagline mb-4">Kontakt</span>
          <h1 className="text-5xl font-bold md:text-6xl">Porozmawiajmy o <span className="font-caveat text-primary text-6xl md:text-7xl">celebracji</span></h1>
          <p className="mt-6 text-lg text-muted-foreground">Napisz do nas — odpowiadamy w ciągu 24 godzin.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <div className="card-surface p-8">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-success/15"><CheckCircle2 className="h-8 w-8 text-success" /></div>
                <h2 className="text-2xl font-bold">Dziękujemy!</h2>
                <p className="text-muted-foreground">Twoja wiadomość została wysłana. Odezwiemy się w ciągu 24 godzin.</p>
                <button onClick={() => { setSent(false); setForm({ firstName: '', lastName: '', email: '', message: '' }); }} className="btn-outline mt-4">Wyślij kolejną</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Wyślij wiadomość</h2>
                {error && <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"><XCircle className="h-4 w-4 flex-shrink-0" />{error}</div>}
                <div className="grid gap-4 md:grid-cols-2">
                  <div><label className="mb-1.5 block text-sm font-medium">Imię</label><input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" /></div>
                  <div><label className="mb-1.5 block text-sm font-medium">Nazwisko</label><input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" /></div>
                </div>
                <div><label className="mb-1.5 block text-sm font-medium">Email *</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" /></div>
                <div><label className="mb-1.5 block text-sm font-medium">Wiadomość *</label><textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full rounded-[var(--radius)] border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" /></div>
                <p className="text-xs text-muted-foreground">Klikając „Wyślij" akceptujesz <a href="#" className="text-primary hover:underline">Regulamin</a> i <a href="#" className="text-primary hover:underline">Politykę prywatności</a>.</p>
                <button type="submit" className="btn-primary w-full">Wyślij wiadomość <ArrowRight className="h-4 w-4" /></button>
              </form>
            )}
          </div>

          {/* Offices */}
          <div className="space-y-4">
            {OFFICES.map(o => (
              <div key={o.city} className="card-surface">
                <div className="mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{o.city}</h3>
                  {o.main && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Biuro główne</span>}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2"><MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />{o.addr}</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0" /><a href={`tel:${o.phone}`} className="hover:text-primary">{o.phone}</a></div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 flex-shrink-0" /><a href={`mailto:${o.email}`} className="hover:text-primary">{o.email}</a></div>
                </div>
              </div>
            ))}
            <div className="card-surface bg-gradient-accent text-white">
              <MessageSquare className="mb-3 h-8 w-8" />
              <h3 className="font-semibold">Wsparcie 24/7</h3>
              <p className="mt-2 text-sm text-white/90">Klienci Caked mają dostęp do dedykowanego opiekuna i wsparcia technicznego przez cały tydzień.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FAQSection />
    <Footer />
  </>);
}

/* ═══════════════════════════════════════════════
   CITY PAGE (/miasta/:slug) — dynamic
   ═══════════════════════════════════════════════ */
const CITY_DATA = {
  'wroclaw': {
    name: 'Wrocław', status: 'live',
    tagline: 'Tu wszystko się zaczęło',
    bakeries: ['Cukiernia Sowa', 'La Patisserie Wrocław', 'Sweet Corner', 'Bio Cukiernia'],
    testimonial: { q: 'Caked obsługuje nasz wrocławski zespół od ponad roku. Torty zawsze na czas, zawsze świeże.', n: 'Anna Kowalska', r: 'HR Manager, TechCorp Wrocław' },
    deliveryZone: 'Dostawy w promieniu 20 km od centrum',
  },
  'warszawa': { name: 'Warszawa', status: 'live', tagline: 'Serce polskiego biznesu', bakeries: ['A. Blikle', 'Cukiernia Królewska', 'Lukullus'], testimonial: { q: 'Warszawski zespół Caked jest bardzo responsywny. Polecam każdej firmie powyżej 50 osób.', n: 'Piotr Nowak', r: 'Dyrektor operacyjny, FinanceHub' }, deliveryZone: 'Dostawy w całej Warszawie i okolicach' },
  'krakow': { name: 'Kraków', status: 'live', tagline: 'Królewska stolica cukiernictwa', bakeries: ['Cukiernia Michałek', 'Sweet Cake Kraków'], testimonial: { q: 'W Krakowie Caked działa bez zarzutu. Torty z lokalnych cukierni — czuć tradycję.', n: 'Magdalena Wiśniewska', r: 'CEO, Marketing Plus' }, deliveryZone: 'Kraków + Tarnów' },
  'poznan': { name: 'Poznań', status: 'live', tagline: 'Słodkie Wielkopolski', bakeries: ['Pożegnanie z Afryką', 'Gurman Cukiernia'], testimonial: { q: 'Poznań pokochał Caked. Torty są naprawdę doskonałe.', n: 'Tomasz Lewandowski', r: 'People Lead, StartupHub' }, deliveryZone: 'Poznań + Swarzędz + Luboń' },
  'gdansk': { name: 'Gdańsk', status: 'live', tagline: 'Bałtycka słodycz', bakeries: ['Bałtycka Cukiernia', 'Torcik Gdański'], testimonial: { q: 'Caked to najlepsza inwestycja w kulturę firmy w tym roku.', n: 'Kasia Zielińska', r: 'HR Director, BaltTech' }, deliveryZone: 'Trójmiasto (Gdańsk, Gdynia, Sopot)' },
  'katowice': { name: 'Katowice', status: 'live', tagline: 'Śląsk na słodko', bakeries: ['Cukiernia Śląska', 'Katowickie Torty'], testimonial: { q: 'Świeży start z Caked — pierwsze urodziny już za nami.', n: 'Michał Wójcik', r: 'COO, Silesia Ventures' }, deliveryZone: 'Katowice + Gliwice + Tychy' },
  'lodz': { name: 'Łódź', status: 'soon' },
  'lublin': { name: 'Lublin', status: 'soon' },
  'szczecin': { name: 'Szczecin', status: 'soon' },
};

function CityPage() {
  const { pathname } = useLocation();
  const slug = pathname.split('/').pop();
  const data = CITY_DATA[slug];
  useTitle(`${data?.name || 'Miasto'} | Caked`);

  if (!data) return (
    <section className="section"><div className="container text-center">
      <h1 className="text-4xl font-bold">Miasto nie znalezione</h1>
      <Link to="/" className="btn-primary mt-6 inline-flex">Wróć na stronę główną</Link>
    </div></section>
  );

  if (data.status === 'soon') {
    return (<>
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="tagline mb-4">Wkrótce</span>
            <h1 className="text-5xl font-bold md:text-6xl">{data.name} — <span className="font-caveat text-primary text-6xl md:text-7xl">już wkrótce</span></h1>
            <p className="mt-6 text-lg text-muted-foreground">Szykujemy coś słodkiego w {data.name}! Zapisz się na listę, a damy znać, gdy ruszymy.</p>
            <form onSubmit={e => { e.preventDefault(); alert(`Zapisaliśmy Twój email dla ${data.name}. Damy znać!`); }} className="mx-auto mt-8 flex max-w-md gap-2">
              <input type="email" required placeholder="Twój email" className="flex-1 rounded-[var(--radius)] border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              <button type="submit" className="btn-primary">Powiadom mnie</button>
            </form>
            <div className="mt-8">
              <Link to="/miasta/wroclaw" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                Zobacz Wrocław <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>);
  }

  // Live city
  const cityCakes = CAKES_DATA.slice(0, 6);
  return (<>
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="tagline mb-4">Caked w {data.name}</span>
          <h1 className="text-5xl font-bold md:text-6xl">{data.name} — <span className="font-caveat text-primary text-6xl md:text-7xl">{data.tagline}</span></h1>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-success/15 px-4 py-2 text-sm font-medium text-success"><Truck className="h-4 w-4" />{data.deliveryZone}</p>
        </div>
      </div>
    </section>

    {/* Bakeries */}
    <section className="section bg-card/50">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Partnerzy cukierniczy</h2>
          <p className="mt-4 text-muted-foreground">Z kim pracujemy w {data.name}.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.bakeries.map(b => (
            <div key={b} className="card-surface text-center">
              <ChefHat className="mx-auto mb-3 h-10 w-10 text-primary" />
              <h3 className="font-semibold">{b}</h3>
              <div className="mt-2 flex justify-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-gold text-gold" />)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Cakes */}
    <section className="section">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Torty w {data.name}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{cityCakes.map(cake => (
          <div key={cake.name} className="card-surface overflow-hidden">
            <div className={`flex h-48 items-center justify-center rounded-t-[calc(var(--radius)-1px)] bg-gradient-to-br ${cake.gr}`}><span className="text-5xl">🎂</span></div>
            <div className="p-5"><h3 className="text-lg font-semibold">{cake.name}</h3><p className="text-sm text-muted-foreground">{cake.bakery}</p><div className="mt-3 flex items-center justify-between"><span className="text-xl font-bold text-primary">{cakePrice(cake.price)}</span><button className="btn-primary py-1.5 text-xs">Zamów</button></div></div>
          </div>
        ))}</div>
      </div>
    </section>

    {/* Local testimonial */}
    <section className="section bg-card/50">
      <div className="container">
        <div className="mx-auto max-w-2xl card-surface p-10 text-center">
          <Quote className="mx-auto h-10 w-10 text-primary/40" />
          <p className="mt-6 text-xl leading-relaxed">„{data.testimonial.q}"</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-accent text-white text-lg font-bold">{data.testimonial.n[0]}</div>
            <div className="text-left"><div className="font-semibold">{data.testimonial.n}</div><div className="text-xs text-muted-foreground">{data.testimonial.r}</div></div>
          </div>
        </div>
      </div>
    </section>

    <FooterCta />
    <Footer />
  </>);
}

/* ═══════════════════════════════════════════════
   DASHBOARD: ORDERS PAGE (/zamowienia)
   ═══════════════════════════════════════════════ */
const ORDERS = [
  { id: 'CK-2026-0047', emp: 'Anna Kowalska', cake: 'Tort czekoladowy', date: '2026-04-18', status: 'delivered', price: '149 PLN', bakery: 'Cukiernia Sowa' },
  { id: 'CK-2026-0046', emp: 'Piotr Nowak', cake: 'Sernik nowojorski', date: '2026-04-24', status: 'inProgress', price: '129 PLN', bakery: 'Seromania' },
  { id: 'CK-2026-0045', emp: 'Magda Wiśniewska', cake: 'Red Velvet', date: '2026-05-03', status: 'ordered', price: '169 PLN', bakery: 'Cukiernia Sowa' },
  { id: 'CK-2026-0044', emp: 'Tomasz Lewandowski', cake: 'Tort owocowy', date: '2026-06-15', status: 'ordered', price: '189 PLN', bakery: 'Sweet Corner' },
  { id: 'CK-2026-0043', emp: 'Kasia Zielińska', cake: 'Tort waniliowy', date: '2026-04-10', status: 'delivered', price: '159 PLN', bakery: 'La Patisserie' },
  { id: 'CK-2026-0042', emp: 'Wojtek Kowal', cake: 'Tort bezglutenowy', date: '2026-04-08', status: 'delivered', price: '179 PLN', bakery: 'Bio Cukiernia' },
];
const ORDER_STATUS = { ordered: { label: 'Zamówiony', c: 'bg-gold/15 text-gold-foreground' }, inProgress: { label: 'W przygotowaniu', c: 'bg-primary/15 text-primary' }, delivered: { label: 'Dostarczony', c: 'bg-success/15 text-success' } };

function OrdersPage() {
  useTitle('Zamówienia | Caked');
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? ORDERS : ORDERS.filter(o => o.status === filter);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Zamówienia</h1>
          <p className="text-sm text-muted-foreground">Wszystkie zamówienia tortów w Twojej firmie.</p>
        </div>
        <button className="btn-primary py-2 text-sm"><Plus className="h-4 w-4" /> Nowe zamówienie</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {[['all', 'Wszystkie'], ['ordered', 'Zamówione'], ['inProgress', 'W przygotowaniu'], ['delivered', 'Dostarczone']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === k ? 'bg-primary text-primary-foreground' : 'border border-border bg-card hover:border-primary'}`}>{l}</button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-[var(--radius)] border border-border bg-card shadow-glass">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="p-4 text-left font-semibold">Nr</th><th className="p-4 text-left font-semibold">Pracownik</th><th className="p-4 text-left font-semibold">Tort</th>
            <th className="p-4 text-left font-semibold">Cukiernia</th><th className="p-4 text-left font-semibold">Data</th>
            <th className="p-4 text-right font-semibold">Kwota</th><th className="p-4 text-center font-semibold">Status</th>
          </tr></thead>
          <tbody>{filtered.map(o => (
            <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="p-4 font-mono text-xs text-primary">{o.id}</td>
              <td className="p-4 font-medium">{o.emp}</td>
              <td className="p-4 text-muted-foreground">{o.cake}</td>
              <td className="p-4 text-muted-foreground">{o.bakery}</td>
              <td className="p-4 text-muted-foreground">{new Date(o.date).toLocaleDateString('pl-PL')}</td>
              <td className="p-4 text-right font-medium">{cakePrice(o.price)}</td>
              <td className="p-4 text-center"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS[o.status].c}`}>{ORDER_STATUS[o.status].label}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD: BAKERIES PAGE (/cukiernie)
   ═══════════════════════════════════════════════ */
const BAKERIES = [
  { name: 'Cukiernia Sowa', city: 'Wrocław', rating: 4.9, orders: 47, specialties: ['Czekoladowy', 'Red Velvet'] },
  { name: 'La Patisserie Wrocław', city: 'Wrocław', rating: 4.8, orders: 32, specialties: ['Waniliowy', 'Francuski'] },
  { name: 'Sweet Corner', city: 'Wrocław', rating: 4.9, orders: 28, specialties: ['Owocowy', 'Sernik'] },
  { name: 'Bio Cukiernia', city: 'Wrocław', rating: 4.7, orders: 19, specialties: ['Bezglutenowy', 'Wegański'] },
  { name: 'A. Blikle', city: 'Warszawa', rating: 5.0, orders: 52, specialties: ['Klasyczny', 'Premium'] },
  { name: 'Cukiernia Michałek', city: 'Kraków', rating: 4.8, orders: 24, specialties: ['Tradycyjny', 'Krakowski'] },
];

function BakeriesPage() {
  useTitle('Cukiernie partnerskie | Caked');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cukiernie partnerskie</h1>
        <p className="text-sm text-muted-foreground">Zaufani partnerzy, którzy pieką dla Twojego zespołu.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {BAKERIES.map(b => (
          <div key={b.name} className="card-surface">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-accent text-white"><ChefHat className="h-6 w-6" /></div>
                <div><h3 className="font-semibold">{b.name}</h3><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{b.city}</p></div>
              </div>
              <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-gold text-gold" /><span className="font-bold">{b.rating}</span></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {b.specialties.map(s => <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{s}</span>)}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">{b.orders} zamówień</span>
              <button className="text-xs font-medium text-primary hover:underline">Szczegóły →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD: PROFILE PAGE (/profil)
   ═══════════════════════════════════════════════ */
function ProfilePage() {
  useTitle('Profil | Caked');
  const { user } = useAuth();
  const [notif, setNotif] = useState({ email: true, browser: true, sms: false });
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Mój profil</h1>
      <section className="card-surface">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-accent text-white text-3xl font-bold">{user?.name?.[0] || 'U'}</div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.username}@caked.pl · {user?.role}</p>
          </div>
        </div>
      </section>
      <section className="card-surface space-y-4">
        <h2 className="text-lg font-semibold">Dane osobowe</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-medium">Imię i nazwisko</label><input defaultValue={user?.name} className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm" /></div>
          <div><label className="mb-1.5 block text-sm font-medium">Email</label><input defaultValue={`${user?.username}@caked.pl`} className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm" /></div>
        </div>
        <button className="btn-primary py-2 text-sm"><Save className="h-4 w-4" /> Zapisz</button>
      </section>
      <section className="card-surface space-y-4">
        <h2 className="text-lg font-semibold">Powiadomienia</h2>
        {[['email', 'Email', 'Powiadomienia mailowe o nadchodzących urodzinach'], ['browser', 'Przeglądarka', 'Push notifications w przeglądarce'], ['sms', 'SMS', 'Powiadomienia SMS o krytycznych zdarzeniach']].map(([k, l, d]) => (
          <div key={k} className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div><div className="font-semibold">{l}</div><div className="text-xs text-muted-foreground">{d}</div></div>
            <button onClick={() => setNotif(n => ({ ...n, [k]: !n[k] }))} className={`relative h-7 w-12 rounded-full transition ${notif[k] ? 'bg-primary' : 'bg-muted'}`} role="switch" aria-checked={notif[k]}>
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${notif[k] ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </section>
      <section className="card-surface">
        <h2 className="text-lg font-semibold">Zmiana hasła</h2>
        <div className="mt-4 space-y-3">
          <input type="password" placeholder="Obecne hasło" className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm" />
          <input type="password" placeholder="Nowe hasło" className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm" />
          <input type="password" placeholder="Potwierdź nowe hasło" className="w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm" />
          <button className="btn-outline py-2 text-sm"><Lock className="h-4 w-4" />Zmień hasło</button>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════ */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/cakes" element={<CakesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/o-nas" element={<AboutPage />} />
              <Route path="/software" element={<SoftwarePage />} />
              <Route path="/integracje" element={<IntegrationsPage />} />
              <Route path="/kontakt" element={<ContactPage />} />
              <Route path="/miasta/:slug" element={<CityPage />} />
            </Route>

            {/* Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected dashboard */}
            <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/company-settings" element={<SettingsPage />} />
              <Route path="/zamowienia" element={<OrdersPage />} />
              <Route path="/cukiernie" element={<BakeriesPage />} />
              <Route path="/profil" element={<ProfilePage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="flex min-h-screen items-center justify-center"><div className="text-center"><h1 className="text-6xl font-bold text-primary">404</h1><p className="mt-4 text-muted-foreground">Strona nie istnieje.</p><Link to="/" className="btn-primary mt-6 inline-flex">Wróć na stronę główną</Link></div></div>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
