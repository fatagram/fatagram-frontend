import React from "react";

// Bọc component trong React.memo để tránh render lại khi không cần thiết
const HomePage: React.FC = () => {

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
};

export default HomePage;
