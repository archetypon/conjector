
export function contentInjection(conjecture) {
    return new Promise((resolve, reject) => {
        fetch('/api/graph/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ predicate: conjecture })
        })
        .then((response) => {
            if (response.status === 200)
                return response.json();
            else
                reject(Error('BadUsage'));
        })
        .then((data) => {
            if(!data.sparql)
                resolve({data: data.graphyObj.graphs, 
                    sparql: data.sparql});
            else
                resolve({
                    graphyList: data.graphyList,
                    strList: data.strList,
                    sparql: data.sparql
                });
        })
        .catch((err) => {
            reject(Error('BadUsage'));
        });
    });
}

export function login(mail, username, password, scope) {
    return new Promise((resolve, reject) => {
        fetch('/api/users/' + scope, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ mail: mail, username: username, password: password })
        })
        .then(function (response) {
            response.text().then((text) => {
                if (response.status === 401) {
                    reject(Error('WrongCredentialError'));
                } else if (response.status === 400 &&
                    text === "Missing username parameter") {
                    reject(Error('MissingParamError'));
                } else if (response.status === 500) {
                    reject(new Error('BadUsageError'));
                } else if (response.status === 400 && text === "Username already taken") {
                    reject(new Error('UserTaken'));
                } else if (response.status === 200) {
                    resolve(true);
                }
            });            
        })
        .catch(function (error) {
            console.log(error);
        });

    })
}

export function logout() {
    fetch('/api/users/auth', {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json'
        }, 
        body: JSON.stringify({ })
    }).then((res) => {
        window.document.location = '/';
    }).catch((err) => {
        window.document.location = '/';
    });
}

export function findBySubject(subject) {
    return new Promise((resolve, reject) => {

        let preURL = '/api/graph?';
        let query = new URLSearchParams();
        Array.from(subject).forEach((e) => {
            query.append("subject", e);
            
        });
        query.append('timezone',
            Intl.DateTimeFormat().resolvedOptions().timeZone);
        fetch(preURL + query, {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        }).then((res) => res.json())
        .then((data) => {
            data.graphyList.sort((a, b) => a.ctx - b.ctx);
            resolve(data);
        }).catch((err) => {
            console.log(err)
        });
    });
}

export function getPrefixes() {
    return new Promise((resolve, reject) => {
        fetch('/api/graph/presets')
            .then((res) => res.json())
            .then((data) => {
                resolve(data.sList)
            });
        });
}
