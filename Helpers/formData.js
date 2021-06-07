export default data = [
    {
        id:1,
        publication_date: "2021-10-03",
        title:"Pollution in cities",
        color: "#34cceb",
        image: require("../Images/pollution.png"),
        duration: "5 min",
        description: "You will have to take a few pictures facing the sky of your city. This data will allow us to calculate the pollution of the cities from the colours of the sky and the clouds.",
        sensors: ["Photo sensor"],
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
                title: "Take a picture of your city.",
                type: "image",
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
        sensors: ["Microphone sensor"],
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
                title: "Record sound in your city",
                type: "audioRecord",
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
        sensors: ["Barometer"],
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
                title: "Your current atmospheric pressure",
                type: "pressure",
            }
        ]
    }

 ]
