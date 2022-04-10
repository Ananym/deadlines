

const daysOfWeek = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function calculateDeadline(county, courtDeadline) {

    if(!courtDeadline)
    {
        return undefined;
    }

    const proposedPublicationDate = courtDeadline.clone();

    console.log(`${county.name} publishes on ${Object.keys(county.publicationDays)}, while selected date is ${courtDeadline.format("dddd, MMMM Do")}`)

    while(!(daysOfWeek[proposedPublicationDate.isoWeekday()] in county.publicationDays))
    {
        proposedPublicationDate.subtract(1,'days');
        console.log(`Backtracking, current proposed date is ${proposedPublicationDate.format("dddd, MMMM Do")}`);
    }


    const publicationDate = proposedPublicationDate;
    const pubDayName = daysOfWeek[publicationDate.isoWeekday()];
    const publicationDetails = county.publicationDays[pubDayName];
    const submissionDate = publicationDate.clone().subtract(publicationDetails.daysPrior,'days');

    console.log(`${county.name} publishes on ${Object.keys(county.publicationDays)}, will publish on ${publicationDate.format("dddd, MMMM Do")} so its deadline is ${submissionDate.format("dddd, MMMM Do")} because daysPrior is ${publicationDetails.daysPrior}`)

    return {submissionDate, submissionTime:publicationDetails.time};

}

export default calculateDeadline;