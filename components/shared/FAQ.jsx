import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"

const FAQ = () => {

    return <div className={`mt-12 lg:mt-0 w-full flex flex-col items-center`}>
        <h1 className={`text-lg md:text-xl lg:text-3xl font-semibold tracking-tighter`}>Frequently Asked Questions</h1>
        <div className={`mx-auto flex flex-col items-center w-full lg:w-3/4`}>

            <Accordion type="single" collapsible className="w-full flex flex-col gap-4 mt-8 md:mt-12 lg:mt-16">
                <AccordionItem className={`border px-6 py-2 rounded-[36px]`} value="item-1">
                    <AccordionTrigger>What is an uncontested Divorce?</AccordionTrigger>
                    <AccordionContent>
                        A divorce is uncontested as long as your spouse does not retain a lawyer to fight the divorce
                        and in the process spends a lot of money. Your spouse may also contest the divorce without a
                        lawyer but it’s not easy and does not happen often.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className={`border px-6 py-2  rounded-[36px]`} value="item-2">
                    <AccordionTrigger>Does my spouse need to sign?</AccordionTrigger>
                    <AccordionContent>
                        NO. Your spouse’s signature is not needed. However, they need to be notified of the ongoing
                        proceedings. It is possible to serve the spouse without their signature.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className={`border px-6 py-2  rounded-[36px]`} value="item-3">
                    <AccordionTrigger>What if we have children together?</AccordionTrigger>
                    <AccordionContent>
                        While deciding matters of child custody, visitation, and support, it is important to remember
                        what is best for the children. So long as you two have reached a mutual agreement, we can
                        certainly include that in your Divorce package.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className={`border px-6 py-2  rounded-[36px]`} value="item-4">
                    <AccordionTrigger>What if we own property?</AccordionTrigger>
                    <AccordionContent>
                        So long as you and your spouse have mutually decided as to how you are going to settle the
                        property and can provide us with a written statement, we will type up the information in the
                        Divorce Package according to the agreement you have with your spouse.
                    </AccordionContent>
                </AccordionItem><AccordionItem className={`border px-6 py-2  rounded-[36px]`} value="item-5">
                <AccordionTrigger>For an UNCONTESTED Divorce, do I need a lawyer?</AccordionTrigger>
                <AccordionContent>
                    NO. We will type your Divorce package as per your information and your instructions. However, you
                    may choose to hire a lawyer, but that is very expensive.
                </AccordionContent>
            </AccordionItem><AccordionItem className={`border px-6 py-2  rounded-[36px]`} value="item-6">
                <AccordionTrigger>Do I have to go to Court?</AccordionTrigger>
                <AccordionContent>
                    Once, in the end. Your spouse is not required to appear; however, you do. On the hearing date
                    scheduled by the court, you will appear for a short while when the Judge will finalize your divorce.
                </AccordionContent>
            </AccordionItem><AccordionItem className={`border px-6 py-2  rounded-[36px]`} value="item-7">
                <AccordionTrigger> How much does it cost?</AccordionTrigger>
                <AccordionContent>
                    Our fee is $399 and the court fee is $300. A total of $699.
                </AccordionContent>
            </AccordionItem>
            </Accordion>

        </div>
    </div>
}

export default FAQ