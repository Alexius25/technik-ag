
import Image from "next/image";

type FeatureSectionProps = {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    reverse?: boolean;
    className?: string;
};

function FeatureSection({
    title,
    description,
    imageSrc,
    imageAlt,
    reverse = false,
    className = "",
}: FeatureSectionProps) {
    return (
        <section
            className={`rounded-xl bg-accent p-4 sm:p-6 md:p-8 dark:bg-accent-foreground ${className}`}
        >
            <div
                className={`flex flex-col gap-5 md:flex-row md:items-center md:gap-8 ${
                    reverse ? "md:flex-row-reverse" : ""
                }`}
            >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted md:w-1/2 md:shrink-0">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1152px) 45vw, 528px"
                        className="object-cover transition-transform duration-300 ease-out motion-safe:hover:scale-[1.03]"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                        {title}
                    </h2>

                    <p className="max-w-prose text-base leading-7 text-foreground/90">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default function Page() {
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <FeatureSection
                    title="Technik-AG"
                    description="Die Technik-AG des Solitude Gymnasiums Stuttgart-Weilimdorf ist eine engagierte Gruppe von Schülerinnen und Schülern, die sich mit der Planung, Umsetzung und Betreuung von Events und Veranstaltungen an unserer Schule beschäftigt."
                    imageSrc="/main_image.jpg"
                    imageAlt="Die Technik-AG bei der technischen Betreuung einer Schulveranstaltung"
                />

                <FeatureSection
                    title="Überschrift 2"
                    description="Hier kommt der Text hin, der zum unteren Bild gehört."
                    imageSrc="/main_image2.png"
                    imageAlt="Einblick in die Arbeit der Technik-AG"
                    reverse
                    className=""
                />
            </div>
        </main>
    );
}
