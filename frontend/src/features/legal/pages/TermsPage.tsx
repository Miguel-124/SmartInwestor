import { Container, Stack, Typography, Paper, Divider } from "@mui/material";

const COMPANY = {
  name: "Oskar Brózda, Michał Górecki",
  legalForm: "startup studencki",
  address: "Kraków",
  registry: "/",
  nip: "/",
  contactEmail: "oskarbrozdaa@gmail.com",
};

type Section = {
  title: string;
  paragraphs: string[];
};

const sections: Section[] = [
  {
    title: "1. Postanowienia ogólne",
    paragraphs: [
      `Niniejszy Regulamin określa zasady korzystania z aplikacji webowej „SmartInwestor” („Aplikacja”) prowadzonej przez ${COMPANY.name} ${COMPANY.legalForm} z siedzibą: ${COMPANY.address}, („Usługodawca”).`,
      "Regulamin jest regulaminem świadczenia usług drogą elektroniczną.",
      `Kontakt z Usługodawcą: ${COMPANY.contactEmail}.`,
    ],
  },
  {
    title: "2. Definicje",
    paragraphs: [
      "Użytkownik – osoba fizyczna korzystająca z Aplikacji.",
      "Konto – indywidualny dostęp Użytkownika do Aplikacji po rejestracji i logowaniu.",
      "Portfel – zestaw danych tworzonych przez Użytkownika w Aplikacji (np. aktywa, wartości, historia).",
      "Treści – informacje prezentowane w Aplikacji, w tym dane wprowadzone przez Użytkownika oraz materiały Usługodawcy.",
    ],
  },
  {
    title: "3. Wymagania techniczne",
    paragraphs: [
      "Do korzystania z Aplikacji potrzebujesz: aktualnej przeglądarki internetowej, dostępu do Internetu oraz włączonej obsługi JavaScript.",
      "Niektóre funkcje mogą wymagać cookies niezbędnych (np. utrzymanie sesji).",
    ],
  },
  {
    title: "4. Rejestracja i Konto",
    paragraphs: [
      "Założenie Konta wymaga podania adresu e-mail oraz ustanowienia hasła.",
      "Użytkownik jest zobowiązany podawać dane prawdziwe i aktualne w zakresie wymaganym przez Aplikację.",
      "Użytkownik odpowiada za zachowanie poufności danych logowania i za działania wykonane na jego Koncie.",
    ],
  },
  {
    title: "5. Onboarding i pełnoletność",
    paragraphs: [
      "Korzystanie z Aplikacji jest przeznaczone wyłącznie dla osób pełnoletnich (18+).",
      "W ramach onboardingu Użytkownik podaje datę urodzenia w celu potwierdzenia pełnoletności oraz wybiera profil ryzyka/inwestowania.",
      "Użytkownik musi zaakceptować informację o ryzyku inwestycyjnym oraz brak odpowiedzialności Usługodawcy za decyzje inwestycyjne Użytkownika.",
    ],
  },
  {
    title: "6. Zakres usług",
    paragraphs: [
      "Aplikacja umożliwia m.in.: prowadzenie portfeli, dodawanie/edycję/usuwanie aktywów, prezentację danych na wykresach i w tabelach, oraz wyświetlanie analiz i rekomendacji pobieranych z API.",
      "Usługodawca może rozwijać Aplikację, zmieniać jej funkcje oraz dodawać nowe moduły.",
    ],
  },
  {
    title: "7. Ważne zastrzeżenie: brak porady inwestycyjnej",
    paragraphs: [
      "Treści dostępne w Aplikacji mają charakter wyłącznie informacyjny i edukacyjny.",
      "Aplikacja nie stanowi porady inwestycyjnej, rekomendacji w rozumieniu przepisów rynku finansowego ani usługi doradztwa inwestycyjnego.",
      "Decyzje inwestycyjne podejmujesz samodzielnie i na własne ryzyko. Inwestowanie wiąże się z możliwością utraty całości lub części kapitału.",
    ],
  },
  {
    title: "8. Zasady korzystania i zakaz nadużyć",
    paragraphs: [
      "Użytkownik zobowiązuje się korzystać z Aplikacji zgodnie z prawem, Regulaminem oraz dobrymi obyczajami.",
      "Zakazane jest: dostarczanie treści bezprawnych, próby nieautoryzowanego dostępu, zakłócanie działania Aplikacji, wykorzystywanie Aplikacji do oszustw.",
      "Usługodawca może czasowo ograniczyć dostęp lub zablokować Konto w razie podejrzenia nadużyć lub naruszeń.",
    ],
  },
  {
    title: "9. Odpowiedzialność",
    paragraphs: [
      "Usługodawca dokłada starań, aby Aplikacja działała poprawnie, jednak nie gwarantuje braku przerw, błędów ani zgodności Aplikacji z indywidualnymi oczekiwaniami Użytkownika.",
      "Usługodawca nie odpowiada za skutki decyzji inwestycyjnych Użytkownika, w szczególności za straty finansowe wynikające z działań podjętych na podstawie Treści.",
      "Odpowiedzialność Usługodawcy wobec Użytkownika niebędącego konsumentem jest wyłączona w najszerszym zakresie dopuszczalnym przez prawo.",
      "Wobec konsumentów ograniczenia odpowiedzialności nie naruszają bezwzględnie obowiązujących przepisów.",
    ],
  },
  {
    title: "10. Prawa autorskie",
    paragraphs: [
      "Aplikacja oraz jej elementy (m.in. układ, grafiki, logotypy, treści Usługodawcy) są chronione prawem autorskim.",
      "Użytkownik może korzystać z Aplikacji wyłącznie w ramach dozwolonego użytku i zgodnie z Regulaminem.",
    ],
  },
  {
    title: "11. Reklamacje i kontakt",
    paragraphs: [
      `Reklamacje dotyczące działania Aplikacji możesz składać na adres: ${COMPANY.contactEmail}.`,
      "W zgłoszeniu opisz problem oraz podaj dane pozwalające na kontakt. Odpowiemy w rozsądnym terminie, nie dłuższym niż 14 dni, chyba że sprawa jest szczególnie złożona.",
    ],
  },
  {
    title: "12. Zmiany Regulaminu",
    paragraphs: [
      "Regulamin może być zmieniany z ważnych przyczyn, w szczególności: zmiana funkcji Aplikacji, zmiana przepisów, względy bezpieczeństwa.",
      "O zmianach poinformujemy w Aplikacji, a istotne zmiany – z wyprzedzeniem.",
      "Data wejścia w życie: 01.01.2026.",
    ],
  },
  {
    title: "13. Postanowienia końcowe",
    paragraphs: [
      "Prawem właściwym jest prawo polskie.",
      "W sprawach nieuregulowanych zastosowanie mają odpowiednie przepisy, w tym dotyczące świadczenia usług drogą elektroniczną oraz ochrony danych.",
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

export function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2.5}>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            Regulamin
          </Typography>

          <Typography color="text.secondary">
            Regulamin świadczenia usług drogą elektroniczną w ramach Aplikacji
            SmartInwestor.
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
