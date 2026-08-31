package io.semantic.openscore.core.email;

import com.google.common.io.Files;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Alternative;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Alternative
@ApplicationScoped
public class FSMailProvider implements MailProvider {

    private Logger logger = LoggerFactory.getLogger(FSMailProvider.class);

    @Override
    public void send(String to, String subject, String mail) {
        try {
            File folder = new File("/tmp/mail");
            if (!folder.exists()) {
                folder.mkdirs();
            }
            File file = new File(folder, to + "_" + subject + ".html");
            file.createNewFile();
            Files.asCharSink(file, StandardCharsets.UTF_8).write(mail);
            logger.info("Email sent");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
