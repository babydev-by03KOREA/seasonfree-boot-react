package com.seasonfree.client.service;

import com.seasonfree.client.dto.CustomerServiceDTO;
import com.seasonfree.client.dto.CustomerServiceDetailDTO;
import com.seasonfree.client.entity.CustomerService;
import com.seasonfree.client.entity.EmailMessage;
import com.seasonfree.client.repository.CustomerServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class CSService {
    private final CustomerServiceRepository customerServiceRepository;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public Page<CustomerServiceDTO> getCSContact(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<CustomerService> customerServicePage = customerServiceRepository.findAll(pageable);

        return customerServicePage.map(cs -> new CustomerServiceDTO(
                cs.getId(),
                cs.getTitle(),
                cs.getUser().getUsername(),
                cs.getAskDate()
        ));
    }

    @Transactional(readOnly = true)
    public CustomerServiceDetailDTO getCSDetail(Long id) {
        CustomerService customerService = customerServiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 CS 문의 글을 찾을 수 없습니다."));

        return new CustomerServiceDetailDTO(
                customerService.getId(),
                customerService.getTitle(),
                customerService.getContent(),
                customerService.getUser().getUsername(),
                customerService.getAskDate()
        );
    }

    @Transactional
    public void replySendEmail(String email, String comment) {
        EmailMessage emailMessage = EmailMessage.builder()
                .to(email)
                .subject("시즌프리에서 문의하신 내용에 대해 답변 드립니다.")
                .message(comment)
                .build();

        Optional<String> randomCode = Optional.empty();
        emailService.sendMail(emailMessage, randomCode,0);
    }
}
