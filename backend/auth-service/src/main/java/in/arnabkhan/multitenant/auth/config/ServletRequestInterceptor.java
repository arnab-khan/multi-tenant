package in.arnabkhan.multitenant.auth.config;

import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import reactor.core.publisher.Mono;

@Component
public class ServletRequestInterceptor implements WebGraphQlInterceptor {
    @Override
    public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
        // Capture the servlet request before GraphQL execution can change threads.
        var attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        request.configureExecutionInput((input, builder) -> builder
                .graphQLContext(context -> context.put("servletRequest", attributes.getRequest()))
                .build());
        return chain.next(request);
    }
}
