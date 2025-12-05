import CursorSpotlight from '@components/design/CursorSpotlight';

type TechCardProps = {
    name: string;
    icon?: string | null;
};

export default function TechCard({ name, icon }: TechCardProps) {
    return (
        <CursorSpotlight clipBorderRadius="rounded-xl">
            <div className="relative flex flex-col items-center justify-center
                h-50 w-50 rounded-xl bg-neutral-900
                transition-all duration-200
                hover:bg-neutral-800
                overflow-hidden
                group">
                
                <span className="pointer-events-none absolute left-0 top-[10%] h-[80%] w-px
                    bg-white/60 
                    opacity-0 
                    group-hover:opacity-100 
                    transition-opacity duration-300" 
                />
                <span className="pointer-events-none absolute right-0 top-[10%] h-[80%] w-px
                    bg-white/60 
                    opacity-0 
                    group-hover:opacity-100 
                    transition-opacity duration-300" 
                />
                {/* Top border */}
                <span className="pointer-events-none absolute left-[10%] right-[10%] top-0 h-px
                    bg-white/60 
                    opacity-0 
                    group-hover:opacity-80 
                    transition-opacity duration-300" 
                />

                {/* Bottom border */}
                <span className="pointer-events-none absolute left-[10%] right-[10%] bottom-0 h-px
                    bg-white/60 
                    opacity-0 
                    group-hover:opacity-80 
                    transition-opacity duration-300" 
                />


                {icon && (
                    <div className="mb-2 flex items-center justify-center">
                        <img
                            src={icon}
                            alt={`${name} logo`}
                            className="h-10 w-10 filter grayscale opacity-100 
                                group-hover:filter-none group-hover:opacity-100 group-hover:scale-110
                                transition-all duration-500 ease-in-out"
                        />
                    </div>
                )}
                <p className="text-sm font-medium" style={{ cursor: "default" }}>{name}</p>
            </div>
        </CursorSpotlight>

    );
}
