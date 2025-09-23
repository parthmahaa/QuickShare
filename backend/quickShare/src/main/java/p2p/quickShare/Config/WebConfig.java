package p2p.quickShare.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply to all endpoints under /api
                .allowedOrigins("https://quickshare.parthmaha.in", "http://localhost:3000") // Add your frontend origins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // IMPORTANT: Must include OPTIONS
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
