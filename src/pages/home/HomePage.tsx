import React from "react";

// Bọc component trong React.memo để tránh render lại khi không cần thiết
const HomePage: React.FC = () => {
    
    React.useEffect(() => {
        // Thực hiện các tác vụ khi component được mount
        console.log("HomePage mounted");

        // Trả về hàm cleanup nếu cần thiết
        return () => {
            console.log("HomePage unmounted");
        };
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
};

export default HomePage;
