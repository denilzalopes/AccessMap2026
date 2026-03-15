package com.accessmap.notificationservice.config;

import org.springframework.boot.actuate.autoconfigure.mail.MailHealthContributorAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration(exclude = {MailHealthContributorAutoConfiguration.class})
public class HealthConfig {
}
