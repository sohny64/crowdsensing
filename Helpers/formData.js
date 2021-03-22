export default data = [
    {
        id:1,
        publication_date: "2021-10-03",
        title:"Pollution in cities",
        color: "#34cceb",
        image: require("../Images/pollution.png"),
        duration: "5 min",
        description: "You will have to take a few pictures facing the sky of your city. This data will allow us to calculate the pollution of the cities from the colours of the sky and the clouds.",
        sensors: ["GPS Location", "Photo sensor"],
        questions: [
            firstName= {
                name: "firstName",
                title: "First name",
                type: "text"
            },
            lastName= {
                name: "lastName",
                title: "Last name",
                type: "text"
            },
            pollutionInCity= {
                name: "pollutionInCity",
                title: "Have you ever witnessed pollution in your city?",
                type: "text",
            }
        ]
    },
    {
        id:2,
        publication_date: "2021-10-03",
        title:"Decibels in your city",
        color: "#34a8eb",
        image: require("../Images/ecouteur.png"),
        duration: "15 min",
        description: "You will have to take a few pictures facing the sky of your city. This data will allow us to calculate the pollution of the cities from the colours of the sky and the clouds.",
        sensors: ["GPS Location", "Microphone sensor"],
        questions: [
            firstName= {
                name: "firstName",
                title: "First name",
                type: "text"
            },
            lastName= {
                name: "lastName",
                title: "Last name",
                type: "text"
            },
            soundPollutionInCity= {
                name: "soundPollutionInCity",
                title: "Do you have sound pollution in your city ?",
                type: "text",
            }
        ]
    },
    {
        id:3,
        publication_date: "2021-10-03",
        title:"Atmospheric pressure",
        color: "#3483eb",
        image: require("../Images/pression.png"),
        duration: "10 min",
        description: "You will have to take a few pictures facing the sky of your city. This data will allow us to calculate the pollution of the cities from the colours of the sky and the clouds.",
        sensors: ["GPS Location", "Barometer"],
        questions: [
            firstName= {
                name: "firstName",
                title: "First name",
                type: "text"
            },
            lastName= {
                name: "lastName",
                title: "Last name",
                type: "text"
            },
            pressure= {
                name: "pressure",
                title: "What is your current atmospheric pressure ?",
                type: "text",
            }
        ]
    }
 ]