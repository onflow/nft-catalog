import { Button } from "../shared/button-v2";

export function Submitted() {
    return <div className="py-16 ml-24 w-1/2">
        <p className="mb-6 text-7xl font-display font-bold leading-relaxed">Your collection was submitted succesfully</p>
        <p className="mb-16 text-2xl font-semibold">Our internal review team will take a look at your submission. <br /> After approval it will be available in the catalog.</p>
        <a href="/"><Button>Back to homepage</Button></a>
    </div>
}