export default data = [
    {
        id:1,
        publication_date: "2021-10-03",
        title:"Pollution in cities",
        color: "#3e5777",
        image: require("../Images/pollution.png"),
        duration: "5 min",
        description: "You will have to take a few pictures facing the sky of your city. This data will allow us to calculate the pollution of the cities from the colours of the sky and the clouds.",
        sensors: ["Photo sensor"],
        questions: [
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
        color: "#5075a2",
        image: require("../Images/ecouteur.png"),
        duration: "15 min",
        description: "You will have to take a few pictures facing the sky of your city. This data will allow us to calculate the pollution of the cities from the colours of the sky and the clouds.",
        sensors: ["Microphone sensor"],
        questions: [
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
        color: "#6394cf",
        image: require("../Images/pression.png"),
        duration: "10 min",
        description: "You will have to take a few pictures facing the sky of your city. This data will allow us to calculate the pollution of the cities from the colours of the sky and the clouds.",
        sensors: ["Barometer"],
        questions: [
            pressure= {
                name: "pressure",
                title: "Your current atmospheric pressure",
                type: "pressure",
            }
        ]
    }

 ]
