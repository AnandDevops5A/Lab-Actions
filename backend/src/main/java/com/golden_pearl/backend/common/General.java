package com.golden_pearl.backend.common;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.golden_pearl.backend.DRO.UserRegisterData;
import com.golden_pearl.backend.DTO.ResponseUserData;
import com.golden_pearl.backend.Models.Tournament;
import com.golden_pearl.backend.DTO.TournamentDTO;
import com.golden_pearl.backend.Models.User;

import lombok.Data;

@Component
@Data
public class General {

    public LocalDateTime getCurrentDateTime() {
        return LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }

    public Long getCurrentTimeMillis() {
        return getCurrentDateTime().atZone(ZoneId.of("Asia/Kolkata")).toInstant().toEpochMilli();
    }

    public LocalDate getCurrentDate() {
        return LocalDate.now(ZoneId.of("Asia/Kolkata"));
    }

    public List<ResponseUserData> convertUserToResponseUserData(List<User> users) {
        List<ResponseUserData> responseUserDataSet = new ArrayList<>();

        for (User user : users) {
            ResponseUserData responseUserData = new ResponseUserData();
            responseUserData.setUserId(user.getId());
            responseUserData.setUsername(user.getUsername());
            responseUserData.setCallSign(user.getCallSign());
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
                .toList(); // collect into List

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

    public User convertResponseToUser(UserRegisterData user) {
        if (user == null) {
            return null;
        }
        User newUser = new User();
        newUser.setCallSign(user.callSign());
        newUser.setUsername(user.username());
        newUser.setEmail(user.email());
        newUser.setPhoneNumber(user.contact());
        newUser.setAccessKey(user.accessKey());
        // Set other fields as necessary
        return newUser;
    }

    public Integer generateOTP() {
        // Generates a number between 100,000 (inclusive) and 1,000,000 (exclusive)
        return ThreadLocalRandom.current().nextInt(100_000, 1_000_000);

    }

    public TournamentDTO convertToDTO(Tournament tournament) {
        if (tournament == null) {
            return null;
        }
        return new TournamentDTO(
                tournament.getId(),
                tournament.getTournamentName(),
                tournament.getPrizePool(),
                tournament.getDateTime(),
                tournament.getEntryFee(),
                tournament.getSlot(),
                tournament.getPlatform(),
                tournament.getDescription(),
                tournament.getLiveStreamLink());
    }

    public List<TournamentDTO> convertToDTOs(List<Tournament> tournaments) {
        return tournaments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

}
