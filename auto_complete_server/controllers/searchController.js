const client = require("../modules/elasticModule");

const searchController = {
    search: async (req, res) => {
        const {q} = req.query;

        try{
            const result = await client.search({
                index: 'autocomplete_index',
                body: {
                    size: 3,
                    query: {
                        match: { 
                            "text.ngram": q,
                         },
                    },
                    "highlight": {
                        "fields": {
                          "text.ngram": {}
                        },
                      },
                    },
            });


            const searchResult = result.hits.hits;

            const finResult = searchResult.map((item) => {
                const data = item.highlight["text.ngram"];
                console.log(data);
                return {Text:data, score: item._score};
            });

            res.status(200).json({
                message: "검색 성공",
                data: finResult,
            });
        } catch (error){
            console.log(error);
            res.status(500).json({
                message: "ELS 서버 에러"
            });
        }
    },
};

module.exports = searchController;