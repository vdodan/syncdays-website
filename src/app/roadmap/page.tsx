import { Rocket, Hammer, ClipboardList, Lightbulb, CheckCircle } from "lucide-react";
import { Header, Footer, Container, Section, Card, Badge } from "@/components";
import { roadmap, RoadmapItem } from "@/data/roadmap";

const statusConfig = {
  shipped: {
    icon: <Rocket className="h-5 w-5" />,
    label: "Shipped",
    badge: "shipped" as const,
  },
  "in-progress": {
    icon: <Hammer className="h-5 w-5" />,
    label: "In Progress",
    badge: "in-progress" as const,
  },
  planned: {
    icon: <ClipboardList className="h-5 w-5" />,
    label: "Planned",
    badge: "planned" as const,
  },
  considering: {
    icon: <Lightbulb className="h-5 w-5" />,
    label: "Considering",
    badge: "considering" as const,
  },
};

function RoadmapSection({ status, items }: { status: RoadmapItem["status"]; items: RoadmapItem[] }) {
  const config = statusConfig[status];

  if (items.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-sandy-brown">{config.icon}</div>
        <h2 className="text-2xl font-bold text-jet-black">{config.label}</h2>
        <span className="text-pale-oak text-sm">({items.length})</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Card key={index} hover={status !== "shipped"}>
            <div className="flex items-start gap-3">
              {status === "shipped" && (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-semibold text-jet-black mb-1">{item.title}</h3>
                <p className="text-pale-oak text-sm">{item.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const shipped = roadmap.filter((item) => item.status === "shipped");
  const inProgress = roadmap.filter((item) => item.status === "in-progress");
  const planned = roadmap.filter((item) => item.status === "planned");
  const considering = roadmap.filter((item) => item.status === "considering");

  return (
    <main className="min-h-screen">
      <Header />

      <Section className="pt-32 sm:pt-40" animate={false}>
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-jet-black mb-6">
              Roadmap
            </h1>
            <p className="text-lg text-pale-oak max-w-2xl mx-auto">
              See what we&apos;ve built, what we&apos;re working on, and what&apos;s coming next.
              Have a feature request? <a href="/contact" className="text-sandy-brown hover:underline">Let us know!</a>
            </p>
          </div>

          <RoadmapSection status="in-progress" items={inProgress} />
          <RoadmapSection status="planned" items={planned} />
          <RoadmapSection status="considering" items={considering} />
          <RoadmapSection status="shipped" items={shipped} />
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
