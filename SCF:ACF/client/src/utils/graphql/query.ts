const componentsQuery: string = `#graphql
query{
  page(id: "/?", idType: URI) {
    acfPage {
      pageComponents {
        fieldGroupName
        ... on AcfPagePageComponentsHeroLayout {
          fieldGroupName
          heroSection {
            headline
            promo
            image {
              node {
                altText
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
        }
        ... on AcfPagePageComponentsCardsLayout {
          fieldGroupName
          cards {
            headline
            cardContent {
              heading
              image {
                node {
                  altText
                  mediaItemUrl
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              content
            }
          }
        }
      }
    }
  }
}
`;

export const setQuerySlug = (slug: string): string => {
  return componentsQuery.replace("/?", `/${slug}`);
};
