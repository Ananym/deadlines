

const daysOfWeek = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function calculateDeadline(county, courtDeadline) {

    if(!courtDeadline)
    {
        return undefined;
    }

    const proposedPublicationDate = courtDeadline.clone();
    while(!(daysOfWeek[proposedPublicationDate.isoWeekday()] in county.publicationDays))
    {
        proposedPublicationDate.subtract(1,'days');
    }

    const publicationDate = proposedPublicationDate;
    const publicationDetails = county.publicationDays[daysOfWeek[publicationDate.isoWeekday()]];
    const submissionDate = publicationDate.subtract(publicationDetails.daysPrior,'days');

    return {submissionDate, submissionTime:publicationDetails.time};

}

export default calculateDeadline;