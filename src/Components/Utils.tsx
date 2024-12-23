import dayjs from "dayjs"

export function returnDatePickerValue(value: any) {
    return value === "" ? null : dayjs(value, "YYYY-MM-DD").isValid() ? dayjs(value, "YYYY-MM-DD") : null
}

export function returnDatePickerSelectedValue(selectedDate: any, stringValue: any) {
    return selectedDate && stringValue ? dayjs(selectedDate).format("YYYY-MM-DD") : ""
}

export async function startCamera(videoRef: any, setIsCameraOpened: any) {
    try {
        setIsCameraOpened(true)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
};

export async function capturePhoto(canvasRef: any, videoRef: any, setImage: any) {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video && canvas) {
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoDataURL = canvas.toDataURL('image/png');
        setImage(photoDataURL)
        video.width = 0
        video.height = 0
        // const stream = video.srcObject;
        // const tracks = stream.getTracks();
        // tracks.forEach((track: any) => track.stop());
    }
};

export function getBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(typeof (reader.result) === "string" ? reader.result : "");
        reader.onerror = error => reject(error);
    });
}