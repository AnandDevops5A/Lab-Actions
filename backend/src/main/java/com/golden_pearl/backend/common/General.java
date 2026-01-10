package com.golden_pearl.backend.common;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import lombok.Data;



@Data
public class General {
    
     public long getCurrentDateTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        return Long.parseLong(LocalDateTime.now().format(formatter));
    }
}
