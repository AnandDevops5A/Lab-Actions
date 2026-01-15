package com.golden_pearl.backend.common;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.golden_pearl.backend.DRO.UserRegisterData;
import com.golden_pearl.backend.DTO.ResponseUserData;
import com.golden_pearl.backend.Models.User;

import lombok.Data;

@Data
public class General {

    public long getCurrentDateTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        return Long.parseLong(LocalDateTime.now().format(formatter));
    }

    public List<ResponseUserData> convertUserToResponseUserData(List<User> users) {
        List<ResponseUserData> responseUserDataSet = new ArrayList<>();

        for (User user : users) {
            ResponseUserData responseUserData = new ResponseUserData();
            responseUserData.setUserId(user.getId());
            responseUserData.setUsername(user.getUsername());
            responseUserData.setCallSign(user.getCallSign());
            responseUserData.setTotalWin(user.getTotalWin());
            // Add other fields as necessary

            responseUserDataSet.add(responseUserData);
        }

        return responseUserDataSet;
    }

    public List<String> sortedByRank(HashMap<String, Integer> rankList) {
        return rankList.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByValue()) // ascending order
                .map(Map.Entry::getKey) // extract keys
                .collect(Collectors.toList()); // collect into List

    }

    public List<User> sortUserByRank(List<User> users, List<String> sortedByRank) {
        List<User> sortedUsers = new ArrayList<>();
        for (String i : sortedByRank) {
            for (User u : users) {
                if (u.getId() == i) {
                    sortedUsers.add(u);
                    break;
                }
            }
        }
        return sortedUsers;
    }

    public User convertResponseToUser(UserRegisterData userData) {
        User user = User.builder().username(userData.username()).callSign(userData.callSign())
                .contact(userData.contact()).accessKey(userData.accessKey()).joiningDate(getCurrentDateTime())
                .build();
        return user;

    }

}
