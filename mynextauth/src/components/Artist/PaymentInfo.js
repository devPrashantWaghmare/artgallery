import React, { useEffect, useState } from 'react';
import axios from '../../services/api';

const PaymentInfo = (userId) => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`/api/payment-info/${userId}`);
                setPayments(response.data.data);
            } catch (error) {
                console.error('Error fetching payment info:', error);
            }
        };
        fetchPayments();
    }, []);

    return (
        <div>
            <h3>Payment Information</h3>
            <ul>
                {payments.map((payment) => (
                    <li key={payment._id}>
                        {payment.amount} - {payment.date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PaymentInfo;
