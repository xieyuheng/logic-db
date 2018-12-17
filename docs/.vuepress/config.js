module.exports = {
    title: "logic | db",
    description: "combine logic programming and database in js",
    themeConfig: {
        repo: "xieyuheng/logic-db",
        docsRepo: "xieyuheng/logic-db",
        docsDir: "docs",
        docsBranch: "master",
        editLinks: true,
        editLinkText: "Help to improve docs!",
        nav: [
            { text: "Home", link: "/" },
            { text: "Guide", link: "/guide/" },
        ],
        displayAllHeaders: true,
        sidebar: [
            "/guide/install",
            "/guide/",
            {
                title: "Logic Programming",
                children: [
                    "/guide/logic-programming",
                ]
            },
            {
                title: "Database",
                children: [
                    "/guide/database",
                ]
            },
        ],

    },
}
