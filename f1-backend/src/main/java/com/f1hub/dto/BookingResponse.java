package com.f1hub.dto;

import com.f1hub.model.BookingStatus;
import com.f1hub.model.PaymentStatus;
import com.f1hub.model.TicketType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookingResponse(
    Long bookingId,
    String raceName,
    LocalDate raceDate,
    String circuitName,
    String circuitLocation,
    String ticketType,
    Integer quantity,
    BigDecimal totalAmount,
    String bookingStatus,
    String paymentStatus,
    String razorpayPaymentId,
    String razorpayOrderId,
    LocalDateTime bookingDate
) {
    // Constructor that accepts enums and converts to strings
    public BookingResponse(
        Long bookingId,
        String raceName,
        LocalDate raceDate,
        String circuitName,
        String circuitLocation,
        TicketType ticketType,
        Integer quantity,
        BigDecimal totalAmount,
        BookingStatus bookingStatus,
        PaymentStatus paymentStatus,
        String razorpayPaymentId,
        String razorpayOrderId,
        LocalDateTime bookingDate
    ) {
        this(
            bookingId,
            raceName,
            raceDate,
            circuitName,
            circuitLocation,
            ticketType != null ? ticketType.toString() : null,
            quantity,
            totalAmount,
            bookingStatus != null ? bookingStatus.toString() : null,
            paymentStatus != null ? paymentStatus.toString() : null,
            razorpayPaymentId,
            razorpayOrderId,
            bookingDate
        );
    }
}
