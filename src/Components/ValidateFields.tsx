import { ShowToast } from "./CommonComponents"

export function validateFields(payload: any, requiredFieldsObject: any) {
    let fields: any = []
    console.log(payload, requiredFieldsObject)
    let borderColorsObject: any = requiredFieldsObject
    if (Object.keys(payload).length !== 0) {
        if (typeof requiredFieldsObject === "object") {
            Object.entries(requiredFieldsObject).map(([key, value]) => {
                if (payload?.[key] === null || payload?.[key] === "") {
                    fields.push(key)
                    borderColorsObject[key] = "red"
                }
                else {
                    borderColorsObject[key] = ""
                }
            })
        }
    }
    if (fields.length !== 0) {
        return {
            errorMessage: "Please fill required fields " + fields,
            borderColorsObject: borderColorsObject
        }
    }
    else {
        return false
    }
}

export function validateEmail(email: string) {
    const regex = new RegExp(/<(?=>)/)
    if (!email.includes('@') || email.split('@')[0] === "" || regex.test(email) || email.split('@')[1] === "") {
        return false
    }
    else {
        return true
    }
}

export function containsUppercase(str: string) {
    return /[A-Z]/.test(str);
}

export function containsLowercase(str: string) {
    return /[a-z]/.test(str);
}

export function containsNumber(str: string) {
    return /[0-9]/.test(str);
}

export function containsSpecialChars(str: string) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

export function validatePassword(password: string) {
    if (password.length < 8) {
        ShowToast("error", "Password contains atleast 8 characters");
    }
    else {
        var error = "Password contains atleast";
        if (!containsUppercase(password)) {
            error += " one upper case,"
        }

        if (!containsLowercase(password)) {
            error += " one lower case,"
        }

        if (!containsNumber(password)) {
            error += " one number,"
        }

        if (!containsSpecialChars(password)) {
            error += " one special character."
        }

        if (error !== "Password contains atleast") {
            error = error.slice(0, -1) + '.'
            ShowToast("error", error);
        }
    }
}
