import { Plus, Sparkles, Wrench } from "lucide-react";
import { Header, Footer, Container, Section, Card } from "@/components";
import { changelog } from "@/data/changelog";

const typeConfig = {
  added: {
    icon: <Plus className="h-4 w-4" />,
    label: "Added",
    color: "text-green-600 bg-green-100",
  },
  improved: {
    icon: <Sparkles className="h-4 w-4" />,
    label: "Improved",
    color: "text-blue-600 bg-blue-100",
  },
  fixed: {
    icon: <Wrench className="h-4 w-4" />,
    label: "Fixed",
    color: "text-orange-600 bg-orange-100",
  },
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <Section className="pt-32 sm:pt-40" animate={false}>
        <Container size="md">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-jet-black mb-6">
              Changelog
            </h1>
            <p className="text-lg text-pale-oak">
              What&apos;s new, improved, and fixed in SyncDays.
            </p>
          </div>

          <div className="space-y-8">
            {changelog.map((release) => (
              <Card key={release.version} hover={false}>
                <div className="flex items-baseline gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-jet-black">v{release.version}</h2>
                  <span className="text-pale-oak">{release.date}</span>
                </div>

                <ul className="space-y-4">
                  {release.changes.map((change, index) => {
                    const config = typeConfig[change.type];
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                        <span className="text-jet-black pt-0.5">{change.description}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
