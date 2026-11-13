package in.arnabkhan.multitenant.tenant;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class HelloGraphqlController {
    @QueryMapping
    public String hello() {
        return "Hello from tenant service";
    }
}
