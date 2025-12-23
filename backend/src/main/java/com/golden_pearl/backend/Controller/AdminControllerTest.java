package com.golden_pearl.backend.Controller;


import com.golden_pearl.backend.Services.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    /**
     * Test Case 1: Happy Path
     * Description: Verify that the API returns a 200 OK status and the correct data
     * when both repositories return data successfully.
     */
    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllData_shouldReturnData_whenRepositoriesSucceed() throws Exception {
        // Arrange: Mock the service to return some data
        Map<String, Object> mockData = new HashMap<>();
        mockData.put("users", Collections.emptyList());
        mockData.put("tournaments", Collections.emptyList());
        when(adminService.getAllData()).thenReturn(mockData);

        // Act & Assert: Perform the GET request and verify the response
        mockMvc.perform(get("/admin/data"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.users").isArray())
                .andExpect(jsonPath("$.tournaments").isArray());
    }

    /**
     * Test Case 2: Error Path
     * Description: Verify that the API returns a 500 Internal Server Error
     * when one of the repositories throws an exception.
     */
    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllData_shouldReturnError_whenRepositoryFails() throws Exception {
        // Arrange: Mock the service to throw a runtime exception
        String exceptionMessage = "Database connection failed";
        when(adminService.getAllData()).thenThrow(new RuntimeException(exceptionMessage));

        // Act & Assert: Perform the GET request and verify the error response
        mockMvc.perform(get("/admin/data"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("An error occurred while retrieving data"))
                .andExpect(jsonPath("$.error").value(exceptionMessage));
    }

    /**
     * Test Case 3: Security - Unauthorized Access
     * Description: Verify that an unauthenticated request to the admin endpoint is rejected.
     */
    @Test
    void getAllData_shouldReturnUnauthorized_forUnauthenticatedUser() throws Exception {
        // Act & Assert: Perform the GET request without any user credentials and expect 401 Unauthorized
        mockMvc.perform(get("/admin/data"))
                .andExpect(status().isUnauthorized());
    }
}