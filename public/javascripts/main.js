async function getCountries() {
    const request = await fetch('/countries');

    const data = await request.json();

    return data;
}

const countries = await getCountries();

async function createCountriesOption() {

    countries.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.innerText = country;

        document.querySelector('.countries').appendChild(option);
    })
}

function checkIfAllFilled() {
    let statement;
    let allAgreed = false;
    let validPostal;
    let validEmail;
    let restInputed = true;

    let agreeIncrement = 0;
    let mailArray = [];
    let mailElems = [];
    let postArray = [];
    let postElems = [];
    document.querySelectorAll('.data').forEach(field => {
        if(field.classList.contains('vat') && field.value == "") {
            field.value = "0";
        }

        if (field.classList.contains('agreements')) {
            if (field.checked) {
                agreeIncrement++;
            }

            if (agreeIncrement == 3) {
                allAgreed = true;
            }
            return;
        }

        if (field.classList.contains('mail')) {
            mailElems.push(field);
            mailArray.push(field.value);
            if(mailArray.length == 2) {
                mailElems.forEach(elem => {
                    validEmail = emailValidation(elem, mailArray);
                })
            }

            return;
        }

        if (field.classList.contains('post')) {
            postElems.push(field);
            postArray.push(field.value);
            if (postArray.length == 2) {
                postElems.forEach(elem => {
                    validPostal = postCodeFinalValidation(elem);
                })
            }

            return;
        }

        if(field.value == "") {
            restInputed = false;
        }
    })

    if (allAgreed && validPostal && validEmail && restInputed) {
        console.log(restInputed)
        statement = true;
    }

    return statement;
}

function getFormValues() {
    let array = [];

    document.querySelectorAll('.data').forEach(field => {
        if (field.classList.contains('agreements') || field.classList.contains('sameAddress')) {
            return;
        }

        if (field.type == 'checkbox') {
            array.push(field.checked);
            return;
        }

        if (field.type == 'radio') {
            if (field.checked) {
                array.push(field.value);
            }
            return;
        }

        array.push(field.value);
    })

    return array;
}

function upperFirstLetter() {
    document.querySelectorAll('.upper').forEach(field => {
        field.addEventListener('keyup', () => {
            if(field.value.length == 1) {
                field.value = field.value.toUpperCase();
            }
        })
    })
}

function emailValidation(mail, mailArray) {
    let valid;
    if (mail.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        valid = true;
    } else {
        valid = false;
    }

    if(valid) {
        if (mailArray.length == 2) {
            if (mailArray[0] == mailArray[1]) {
                return true;
            } else {
                return false;
            }
        }
    }
}

function emailLiveValidation() {
    let mailArray = [];

    const mailElems = document.querySelectorAll('.mail')
    mailElems.forEach(mail => {
        mail.addEventListener('focusout', () => {
            if(mail == mailElems[0]) {
                mailArray[0] = mail.value;
            } else {
                mailArray[1] = mail.value;
            }

            emailValidation(mail, mailArray);
        })
    })
}

function postCodeFinalValidation(post) {
    if(post.value != 'none') {
        let isGood;
        if (post.value.length != 6) {
            isGood = false;
        } else {
            isGood = true;
        }
        return isGood;
    } else {
        return true;
    }
}

function postcodeValidation() {
    function eventBody(e, post) {
        let value = Number(post.value[post.value.length - 1]);
        if (isNaN(value)) {
            post.value = post.value.slice(0, -1);
        }

        if (post.value.length == 2) {
            if (e.key != 'Backspace') {
                post.value = `${post.value}-`;
            }
        }
    }

    document.querySelectorAll('.post').forEach(post => {
        post.addEventListener('keyup', () => {
            if (post.value.length < 2) {
                post.addEventListener('keyup', (e) => {
                    eventBody(e, post)
                })
            } else {
                post.addEventListener('keydown', (e) => {
                    eventBody(e, post)
                })
            }
        })

        post.addEventListener('focusout', () => {
            return postCodeFinalValidation(post);
        })
    })
}

function showVat() {
    let isTrue;
    document.querySelector('.countries').addEventListener('click', (e) => {
        countries.europeanCountries.every(country => {
            if(e.target.value == country) {
                isTrue = true;
                return false;
            } else {
                isTrue = false;
            }

            return true;
        })

        if(isTrue == undefined) {
            isTrue = false;
        }

        if(isTrue) {
            document.querySelector('.vat').classList.remove('vat--hidden');
            document.querySelector('.vat').value = "";
        } else {
            document.querySelector('.vat').classList.add('vat--hidden');
            document.querySelector('.vat').value = "No from europe";
        }
    })
}

function hideAddress() {
    document.querySelector('.sameAddress').addEventListener('click', (e) => {
        document.querySelector('.address').classList.toggle('address--hidden')
        if(e.target.checked) {
            document.querySelector('.isert').childNodes.forEach(child => {
                if(child.classList) {
                    child.childNodes.forEach(elem => {
                        if(elem.classList) {
                            document.querySelector('.address').childNodes.forEach(childd => {
                                if (childd.classList) {
                                    childd.childNodes.forEach(elemm => {
                                        if(elemm.classList) {
                                            if (elem.dataset.same == elemm.dataset.same) {
                                                elemm.value = elem.value;
                                                return;
                                            } else if(elemm.dataset.same == 'name') {
                                                elemm.value = document.querySelector('.name').value;
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            document.querySelector('.address').childNodes.forEach(childd => {
                if (childd.classList) {
                    childd.childNodes.forEach(elemm => {
                        if (elemm.classList) {
                            elemm.value = "";
                        }
                    })
                }
            })
        }
    })
}

function hideFee() {
    document.getElementsByName('invoice').forEach(invoice => {

        invoice.addEventListener('click', (e) => {
            if(e.target.checked && e.target.classList.contains('fee')) {
                document.querySelector('.invoiceAddress').classList.add('address--hidden')
                document.querySelector('.address').childNodes.forEach(childd => {
                    if (childd.classList) {
                        childd.childNodes.forEach(elemm => {
                            if (elemm.classList) {
                                elemm.value = "none";
                            }
                        })
                    }
                })

                document.querySelector('.vat').classList.add('vat--hidden');
                document.querySelector('.vat').value = "0";

                document.querySelector('.pro').classList.add('vat--hidden')
            } else {
                document.querySelector('.invoiceAddress').classList.remove('address--hidden')
                document.querySelector('.address').childNodes.forEach(childd => {
                    if (childd.classList) {
                        childd.childNodes.forEach(elemm => {
                            if (elemm.classList) {
                                elemm.value = "";
                            }
                        })
                    }
                })

                document.querySelector('.vat').classList.remove('vat--hidden');
                document.querySelector('.vat').value = "";

                document.querySelector('.pro').classList.remove('vat--hidden')
            }
        })
    })
}

createCountriesOption();
upperFirstLetter();
emailLiveValidation();
postcodeValidation();
showVat();
hideAddress();
hideFee();
document.querySelector('.article__button').addEventListener('click', () => {
    if(checkIfAllFilled()) {
        const array = getFormValues();
        console.log(array)
        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(array)
        })
    }
});
