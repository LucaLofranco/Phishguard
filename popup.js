const testButton = document.getElementById("testBtn");
const result = document.getElementById("result");

// button clicked
testButton.addEventListener("click", async () =>{
    // hide button after clicked
    document.getElementById("report").hidden = true;
    result.textContent = "analyzing...";

    // check
    try{
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true});

        // if tab is not gmail
        if(!tab.id || !tab.url.startsWith("https://mail.google.com/")){
            result.textContent = "Please open Gmail.";
            return;
        }

        // send to content.js
        let response = await chrome.tabs.sendMessage(
            tab.id,
            { action: "ANALYZE_EMAIL" }
        );

        // if response fails
        if (!response?.success) {
            result.textContent =
            response?.error || "No email detected.";
            return;
        }

        const email = response.email;

        result.textContent = "Checking URLs and analyzing with Gemini...";
    
        // regex for link
        let urls = [...new Set(email.links.map(link => link.url))].filter(url => /^https?:\/\//i.test(url));
        

        let urlStatus = "No HTTP(S) links to check";
        let data = { threats: [] };

        // = 0, no url
        if (urls.length > 0) {

            // api fetch response
            const apiResponse = await fetch(
                "http://127.0.0.1:3000/check-urls",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        urls: urls.slice(0, 50)
                    })
                }
            );
            // if api response threw error
            if (!apiResponse.ok) {
                throw new Error("URL reputation check failed");
            }

            data = await apiResponse.json();
        
            console.log("Safe Browsing results:", data);

            // if theres threats
            if (data.threats.length > 0) {
                urlStatus = "Known threats detected.";
            } 
            else {
                urlStatus = "No known threats found.";
            }
        }

        console.log("starting ai req.");
        // ai response
        const aiResponse = await fetch(
            "http://127.0.0.1:3000/analyze-email",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sender: email.sender,
                    subject: email.subject,
                    body: email.body,
                    links: email.links
                })
            }
        );
        console.log("2. Gemini responded:", aiResponse.status);
        // if ai response threw error
        if (!aiResponse.ok) {
            throw new Error("Gemini analysis failed");
        }

        const analysis = await aiResponse.json();

        console.log("Gemini response:", analysis);

        let finalRisk;

        if(data.threats.length > 0){
            finalRisk = "HIGH";
        }
        else {
            finalRisk = analysis.riskLevel;
        }
        console.log("Both API checks completed!");
        

        // get report and riskcard elements
        const report = document.getElementById("report");
        const riskCard = document.getElementById("riskCard");

        // display email details
        document.getElementById("emailSubject").textContent = email.subject;
        document.getElementById("emailSender").textContent = email.sender;

        // display risk
        document.getElementById("riskLevel").textContent = finalRisk;
        riskCard.classList.remove("high", "medium", "low");

        if (["HIGH", "MEDIUM", "LOW"].includes(finalRisk)) {
            riskCard.classList.add(finalRisk.toLowerCase());
        }

        // display risk summary
        const riskMessages = {
            HIGH: "Potential phishing attempt detected.",
            MEDIUM: "This email contains suspicious indicators.",
            LOW: "No strong phishing indicators identified.",
            UNKNOWN: "Unable to determine the email's risk."
        };
        document.getElementById("riskSummary").textContent = riskMessages[finalRisk] || riskMessages.UNKNOWN;

        // display URL status
        document.getElementById("urlStatus").textContent = urlStatus;

        // display AI explanation
        document.getElementById("aiExplanation").textContent = analysis.explanation;

        // display indicators
        const indicatorsList = document.getElementById("indicators");
        indicatorsList.replaceChildren();

        for (const indicator of analysis.indicators) {
            const item = document.createElement("li");
            item.textContent = indicator;
            indicatorsList.appendChild(item);
        }

        // make report visible
        report.hidden = false;

        result.textContent = "Analysis complete.";
    }
    // error handling
    catch (error) {
        console.error("PhishGuard error:", error);
        result.textContent = "Analysis failed: " + error.message;
    }
});
