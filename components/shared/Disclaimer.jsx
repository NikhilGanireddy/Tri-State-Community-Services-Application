const Disclaimer = () => {

    return <div className={`mt-12 md:mt-16 lg:mt-24 flex flex-col gap-6 lg:gap-12 px-6 py-5`}>
        <h1 className={`text-lg md:text-xl lg:text-3xl font-bold tracking-tighter`}>Disclaimer</h1>
        <div className={`space-y-4 flex flex-col w-full`}>
            <p className={` text-sm`}>
                <span className={`font-semibold text-orange-500`}>Tri State Community Services</span> is a document preparation service,
                providing non-lawyer filing and
                typing assistance. Please note, we are <span className={`font-semibold text-orange-500`}>not a law firm</span> and <span
                className={`font-semibold text-orange-500`}>do not practice law</span>, nor do we provide
                any legal advice or representation.
            </p>
            <p className={` text-sm`}> Our services are intended to assist you with preparing legal documents based on your instructions.
                However, <span
                    className={`font-semibold text-orange-500`}>our service is not a substitute for professional legal advice</span>.
            </p>
            <p className={` text-sm`}> You, the customer, are <span className={`font-semibold text-orange-500`}>solely responsible for the accuracy and completeness</span> of
                the information you
                provide. It is your responsibility to ensure that the details submitted are correct before the documents
                are filed in court.
            </p>
            <p className={` text-sm`}> If you are unsure about your legal rights, require specific legal guidance, or feel uncomfortable
                representing yourself, we <span className={`font-semibold text-orange-500`}>strongly recommend consulting with or hiring a licensed attorney</span> to
                meet
                your needs.
            </p>
            <p className={` text-sm`}> By using our service, you acknowledge and accept these terms.

            </p>
        </div>
    </div>
}

export default Disclaimer;