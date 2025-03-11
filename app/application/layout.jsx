
export const metadata = {
    title: "Tri State Community Services",
    description: "Uncontested Divorce $399",
};

export default function Layout({ children }) {
    return (
            <div lang="en" className={`min-h-screen h-full m-0 text-base funnel-display-400 text-black min-w-[100vw]`}>
                { children }
            </div>
    );
}
