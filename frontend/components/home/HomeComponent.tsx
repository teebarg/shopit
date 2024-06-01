import Image from "next/image";
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const features = [
    {
        name: "Push to deploy",
        description: "Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.",
        icon: CloudArrowUpIcon,
    },
    {
        name: "SSL certificates",
        description: "Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.",
        icon: LockClosedIcon,
    },
    {
        name: "Simple queues",
        description: "Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.",
        icon: ArrowPathIcon,
    },
    {
        name: "Advanced security",
        description: "Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.",
        icon: FingerPrintIcon,
    },
];

export default async function HomeComponent() {
    return (
        <>
            <div className="bg-slate-50 px-6">
                <div className="max-w-2xl mx-auto py-8">
                    <div className="text-center relative">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-700 font-display">
                            The fast, easy way to{" "}
                            <span className="from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b">develop</span> apps and
                            websites
                        </h1>
                        <p className="mt-6 text-lg text-gray-600">
                            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam
                            occaecat fugiat aliqua. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam aperiam cum cupiditate quasi
                            dolor nulla explicabo, similique sit reprehenderit quisquam numquam delectus? Consequuntur natus sapiente quidem fugit
                            deserunt nam perferendis?
                        </p>
                        <div className="relative max-w-7xl w-auto h-[500px] mt-4">
                            <Image src="/hero.jpg" alt="hero" fill />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-100 py-10 px-6">
                <div className="max-w-4xl mx-auto">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
            <div className="bg-slate-50 py-10 px-6">
                <div className="max-w-xl mx-auto text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-800 font-display">Get Started</h1>
                    <p className="text-gray-600 mt-2">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro deleniti eius ad sequi, ab minima voluptate quis voluptas
                        inventore. Architecto necessitatibus voluptatibus facilis itaque, sint sed optio aliquid laboriosam ad.
                    </p>
                    <div className="mt-4">
                        <a href="https://blog.niyi.com.ng/" target="_blank" className="whitespace-nowrap font-semibold text-indigo-600">
                            Learn more <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
