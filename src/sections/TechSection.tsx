import GradientText from '@components/design/GradientText';
import TechCard from "@components/design/TechCard/TechCard";
import { techs } from "../data/techs";


export default function TechSection() {
    return (
        <section className="flex flex-col border rounded-lg shadow-lg">
            <GradientText as="h2" text="Technologies" sizeClass="text-3xl font-bold mb-10" gradientStart="var(--color-silver)" gradientEnd="var(--color-blue-python)" className="text-center" />

            <div className="flex flex-wrap gap-6 justify-center pb-10">
                {techs.map((t) => (
                    <TechCard key={t.name} name={t.name} icon={t.icon} />
                ))}
            </div>
        </section>
    );
}
