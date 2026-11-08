function getOpenedEmail(){
    // grabs subject of email
    console.log("start checking...");

    const subjectElement = document.querySelector("h2.hP");

    console.log("Subject element:", subjectElement);

    // if subjet query doesn't exist
    if (!subjectElement) {
        return null;
    }

    // grabs class that contains body of email  
    const messageBodies = [
        // unpacks all the text
        ...document.querySelectorAll(".a3s.aiL")
        // suggestion to solve reading multiple emails
    ].filter(element => element.getClientRects().length > 0);

    const body = messageBodies.at(-1);


    // if body returns false
    if(!body){
        return null;
    }

    const messageContainer = body.closest(".adn");
    const senderElement = messageContainer?.querySelector("[email]");
    const sender = senderElement?.getAttribute("email") || "Unknown sender";

    // grabs links
    const links = [...body.querySelectorAll("a[href]")].map(link => ({
      text: link.innerText.trim(),
      url: link.href
    }));

    // return contents
    return {
    subject: subjectElement.innerText.trim(), sender,
    body: body.innerText, links};
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action !== "ANALYZE_EMAIL"){
        return;
    }
    
    let email = getOpenedEmail();
    
    if (!email){
        sendResponse({
            success: false,
            error: "open email before analyzing."
        });
        return;
    }
    
    sendResponse({
        success: true,
        email
    });
});
    

