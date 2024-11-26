const decodeJWT = () => {
    try {
        let token = localStorage.getItem("jwtToken")
        const base64Url = token.split('.')[1]; // Lấy phần payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Chuyển từ base64url sang base64
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
                .join('')
        );
        return JSON.parse(jsonPayload); // Trả về payload dưới dạng JSON
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

export default decodeJWT

