import { Container, Stack, Typography, Paper, Divider } from "@mui/material";

const COMPANY = {
  name: "Oskar Brózda, Michał Górecki",
  legalForm: "startup studencki",
  address: "Kraków",
  registry: "/",
  nip: "/",
  contactEmail: "oskarbrozdaa@gmail.com",
  privacyEmail: "oskarbrozdaa@gmail.com",
  phone: "/",
};

type Section = {
  title: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    title: "1. Administrator danych",
    paragraphs: [
      `Administratorem Twoich danych osobowych jest ${COMPANY.name} ${COMPANY.legalForm} z siedzibą pod adresem: ${COMPANY.address}, („Administrator”).`,
      `Kontakt w sprawach związanych z prywatnością: ${COMPANY.privacyEmail}.`,
      `Jeżeli Administrator powoła Inspektora Ochrony Danych (IOD), jego dane kontaktowe zostaną podane w tym dokumencie oraz w aplikacji.`,
    ],
  },
  {
    title: "2. Zakres danych, które przetwarzamy",
    paragraphs: [
      "W zależności od tego, jak korzystasz z aplikacji, możemy przetwarzać następujące kategorie danych:",
      "• Dane konta: adres e-mail, identyfikator użytkownika, hasło w postaci zahashowanej, data utworzenia konta, status konta.",
      "• Dane onboardingowe: data urodzenia (w celu potwierdzenia pełnoletności), wybrany profil ryzyka/inwestowania, potwierdzenie akceptacji ryzyka i braku odpowiedzialności.",
      "• Dane portfeli: nazwy portfeli, skład i parametry aktywów dodanych przez użytkownika, historia zmian (w zakresie funkcji aplikacji).",
      "• Dane techniczne i logi: adres IP, identyfikatory sesji/tokenów, typ przeglądarki/urządzenia, zdarzenia bezpieczeństwa (np. nieudane logowania), podstawowe logi serwera.",
      "• Dane komunikacyjne: treść korespondencji, jeśli kontaktujesz się z nami (np. zgłoszenie błędu).",
    ],
  },
  {
    title: "3. Cele i podstawy prawne przetwarzania",
    paragraphs: [
      "Przetwarzamy dane w następujących celach i na podstawach prawnych:",
      "a) Założenie i prowadzenie konta oraz świadczenie usług drogą elektroniczną (podstawa: art. 6 ust. 1 lit. b RODO – wykonanie umowy).",
      "b) Weryfikacja pełnoletności i realizacja procesu onboarding (art. 6 ust. 1 lit. b RODO).",
      "c) Zapewnienie bezpieczeństwa aplikacji, przeciwdziałanie nadużyciom, dochodzenie lub obrona roszczeń (art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes Administratora).",
      "d) Obowiązki prawne (np. rachunkowe, podatkowe) (art. 6 ust. 1 lit. c RODO).",
      "e) Analityka i statystyka – w zależności od konfiguracji: art. 6 ust. 1 lit. a RODO (zgoda) i/lub art. 6 ust. 1 lit. f RODO (uzasadniony interes), przy czym cookies/SDK wymagające zgody uruchamiamy dopiero po jej udzieleniu.",
      "f) Marketing – co do zasady na podstawie zgody (art. 6 ust. 1 lit. a RODO).",
    ],
  },
  {
    title: "4. Profilowanie i zautomatyzowane decyzje",
    paragraphs: [
      "W aplikacji możesz wybrać profil ryzyka/inwestowania. Na tej podstawie możemy dopasowywać treści, układ informacji lub rekomendacje.",
      "Nie podejmujemy wobec Ciebie decyzji wywołujących skutki prawne lub w podobny sposób istotnie na Ciebie wpływających wyłącznie w sposób zautomatyzowany w rozumieniu art. 22 RODO. Jeśli to się zmieni, zaktualizujemy dokument i wdrożymy odpowiednie mechanizmy.",
    ],
  },
  {
    title: "5. Odbiorcy danych",
    paragraphs: [
      "Dane możemy ujawniać wyłącznie w zakresie niezbędnym:",
      "• dostawcom hostingu/infrastruktury IT: lokalnie,",
      "• dostawcom narzędzi do wysyłki e-maili/powiadomień: email@example.com,",
      "• dostawcom analityki: analiza,",
      "• podmiotom uprawnionym na podstawie przepisów prawa (np. organy ścigania) – wyłącznie gdy istnieje podstawa prawna.",
      "Z dostawcami zawieramy umowy powierzenia przetwarzania danych, jeśli jest to wymagane.",
    ],
  },
  {
    title: "6. Przekazywanie danych poza EOG",
    paragraphs: [
      "Co do zasady przechowujemy dane w Europejskim Obszarze Gospodarczym (EOG).",
      "Jeżeli w przyszłości skorzystamy z dostawców spoza EOG, zapewnimy zgodność transferu z RODO (np. standardowe klauzule umowne) i opiszemy to w aktualizacji polityki.",
    ],
  },
  {
    title: "7. Okres przechowywania danych",
    paragraphs: [
      "Przechowujemy dane tylko tak długo, jak to konieczne:",
      "• dane konta i portfeli – przez czas posiadania konta, a po usunięciu konta przez okres niezbędny do rozliczeń i obrony roszczeń (np. do 3 lat, a w przypadku roszczeń – do czasu ich przedawnienia),",
      "• logi bezpieczeństwa – zwykle do 12 miesięcy, chyba że są potrzebne dłużej do wyjaśnienia incydentu,",
      "• korespondencja – przez czas obsługi zgłoszenia oraz ewentualnie przez okres przedawnienia roszczeń.",
      "Konkretne okresy mogą się różnić w zależności od funkcji (np. płatności).",
    ],
  },
  {
    title: "8. Twoje prawa",
    paragraphs: [
      "Przysługują Ci prawa: dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, sprzeciwu oraz wniesienia skargi do organu nadzorczego.",
      `W Polsce organem nadzorczym jest Prezes Urzędu Ochrony Danych Osobowych (${COMPANY.name} nie reprezentuje UODO).`,
      "Jeżeli przetwarzanie odbywa się na podstawie zgody – możesz ją wycofać w dowolnym momencie (wycofanie zgody nie wpływa na zgodność z prawem przetwarzania sprzed jej cofnięcia).",
    ],
  },
  {
    title: "9. Bezpieczeństwo",
    paragraphs: [
      "Stosujemy środki techniczne i organizacyjne adekwatne do ryzyk, m.in. szyfrowanie transmisji (HTTPS), kontrolę dostępu, mechanizmy uwierzytelnienia i logowanie zdarzeń bezpieczeństwa.",
      "Pamiętaj: bezpieczeństwo zależy także od Ciebie – nie udostępniaj hasła i korzystaj z aktualnego oprogramowania.",
    ],
  },
  {
    title: "10. Pliki cookies i podobne technologie",
    paragraphs: [
      "W aplikacji webowej możemy wykorzystywać pliki cookies i podobne technologie (np. localStorage, identyfikatory sesji) w celu:",
      "• zapewnienia działania serwisu (cookies niezbędne),",
      "• utrzymania sesji użytkownika po zalogowaniu,",
      "• bezpieczeństwa i zapobiegania nadużyciom,",
      "• analityki/statystyk,",
      "• marketingu.",
      "Cookies niezbędne mogą działać bez Twojej zgody. Cookies analityczne/marketingowe uruchomimy dopiero po uzyskaniu Twojej zgody w banerze/ustawieniach cookies. Zgoda musi być dobrowolna i aktywna, a odrzucenie powinno być równie łatwe jak akceptacja. ",
      "Ustawienia cookies możesz zmienić w dowolnym momencie w ustawieniach cookies oraz w ustawieniach przeglądarki.",
    ],
  },
  {
    title: "11. Zmiany polityki",
    paragraphs: [
      "Możemy aktualizować Politykę prywatności, w szczególności gdy zmienią się funkcje aplikacji lub przepisy.",
      "O istotnych zmianach poinformujemy w aplikacji lub e-mailem (jeśli będzie to zasadne).",
      "Data ostatniej aktualizacji: 01.01.2026.",
    ],
  },
];

function SectionView({ title, paragraphs }: Section) {
  return (
    <Stack spacing={1}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {paragraphs.map((p) => (
        <Typography key={p} color="text.secondary">
          {p}
        </Typography>
      ))}
    </Stack>
  );
}

export function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2.5}>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            Polityka prywatności
          </Typography>

          <Typography color="text.secondary">
            Niniejszy dokument opisuje zasady przetwarzania danych osobowych w
            aplikacji SmartInwestor („Aplikacja”). Dokument przygotowany jako
            spełnienie obowiązku informacyjnego wynikającego z RODO.
          </Typography>

          <Divider />

          {sections.map((s) => (
            <SectionView
              key={s.title}
              title={s.title}
              paragraphs={s.paragraphs}
            />
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}
