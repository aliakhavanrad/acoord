"use client";

import { useRouter } from "next/navigation";
import styles from "./About.module.css";

export default function About() {
    const router = useRouter();

    const openInNewTab = (url: string) => {
        window.open(url, "_blank")?.focus();
    };

    const handleMainPageClick = () => {
        router.push("/");
    };

    return (
        <div className={styles.aboutContainer}>
            <div className={styles.aboutHeader}>
                <img
                    id="acoord"
                    className={styles.acoord}
                    src="/assets/Icons/ACOORD.png"
                    alt="ACOORD"
                />
                <img
                    id="main-page"
                    className={styles.mainPage}
                    src="/assets/Icons/world.png"
                    alt="Main page"
                    onClick={handleMainPageClick}
                />
            </div>

            <div className={styles.container}>
                <div className={styles.section}>
                    <h3 className={styles.heading}>About</h3>

                    <p className={styles.text}>
                        There are voices in the world around us that make us
                        remember memories in the past; Memories that are partly
                        formed in a certain place and can evoke a sense of joy,
                        sadness, nostalgia or satisfaction for us. Sometimes
                        listening to a recorded sound or part of a piece of
                        music can take us to our childhood home, a secluded
                        street, a green plain or the beach. At Audible
                        Coordinates (ACOORD), we want to make it possible for
                        people to share these location-based audio memories. By
                        visiting the main page of the ACOORD website, you can
                        view all the positions shared by other users on the map
                        and listen to the sounds corresponding to those
                        positions. You can also share your audio memory with
                        others by selecting your desired location on the map.
                    </p>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.heading}>
                        Rules for Uploading Sounds on ACOORD
                    </h3>

                    <div>
                        <p className={styles.text}>
                            To share sounds on ACOORD, we suggest you pay
                            attention to the following:
                        </p>
                        <ul>
                            <li className={styles.listItem}>
                                Audio should not contain copyrighted content.
                            </li>
                            <li className={styles.listItem}>
                                Sound should not contain any discriminatory
                                content (skin color, ethnicity, gender,
                                religion, etc.).
                            </li>
                            <li className={styles.listItem}>
                                The sound should not contain sexual content.
                            </li>
                            <li className={styles.listItem}>
                                The sounds uploaded on the site will be
                                displayed to everyone after confirmation and
                                control of the above items.
                            </li>
                        </ul>

                        <p className={styles.text}>
                            You must send us a report of non-compliance with the
                            copyright by email so that we can process your
                            request.
                        </p>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.heading}>Contact Us</h3>

                    <p className={styles.contactItem}>
                        Email:{" "}
                        <a href="mailto:audible.coordinates@gmail.com">
                            audible.coordinates@gmail.com
                        </a>
                    </p>

                    <p className={styles.contactItem}>
                        Instagram:{" "}
                        <a
                            href="https://www.instagram.com/audible_coordinates"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://www.instagram.com/audible_coordinates
                        </a>
                    </p>
                </div>
            </div>

            <br />
            <br />
            <br />
        </div>
    );
}
