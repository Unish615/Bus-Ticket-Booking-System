package com.busbooking.service;

import com.busbooking.dto.NotificationResponse;
import com.busbooking.entity.Notification;
import com.busbooking.entity.User;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.NotificationRepository;
import com.busbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void createNotification(User user, String title, String message) {
        Notification notification = new Notification(user, title, message);
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getUserNotifications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(n -> new NotificationResponse(
                        n.getId(),
                        n.getTitle(),
                        n.getMessage(),
                        n.getIsRead(),
                        n.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new ResourceNotFoundException("Notification does not belong to user");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }
}
