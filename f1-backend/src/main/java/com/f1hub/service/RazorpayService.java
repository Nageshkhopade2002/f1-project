package com.f1hub.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;

@Service
public class RazorpayService {
    
    @Value("${razorpay.key.id}")
    private String keyId;
    
    @Value("${razorpay.key.secret}")
    private String keySecret;
    
    public String createOrder(BigDecimal amount) throws RazorpayException {
        System.out.println("=== RAZORPAY SERVICE DEBUG START ===");
        System.out.println("KEY ID = " + keyId);
        System.out.println("SECRET LENGTH = " + (keySecret != null ? keySecret.length() : 0));
        
        // Mock mode for placeholder credentials
        if (keyId == null || keyId.contains("your_key_id") || keySecret == null || keySecret.contains("your_key_secret")) {
            System.out.println("USING MOCK MODE - placeholder credentials detected");
            return "order_mock_" + System.currentTimeMillis();
        }
        
        System.out.println("USING REAL RAZORPAY API");
        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount.multiply(new BigDecimal("100")).intValue()); // Convert to paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_" + System.currentTimeMillis());
        
        Order order = razorpay.orders.create(orderRequest);
        return order.get("id");
    }
    
    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        try {
            // Mock verification for test credentials
            if ("rzp_test_your_key_id".equals(keyId)) {
                return true; // Always return true for testing
            }
            
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);
            
            return Utils.verifyPaymentSignature(attributes, keySecret);
        } catch (Exception e) {
            return false;
        }
    }
}