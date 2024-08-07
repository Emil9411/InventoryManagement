import { useState, useEffect } from 'react';
import "../../../index.css";

function AllItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getItems() {
        try {
            const response = await fetch("api/item/getAllItems", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setItems(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getItems();
    }, []);

    if (loading) {
        return (
            <>
                <br />
                <div className="spinner"></div>
            </>
        );
    }
    return (
        <p>Hello world! all items</p>
    );
}

export default AllItems;