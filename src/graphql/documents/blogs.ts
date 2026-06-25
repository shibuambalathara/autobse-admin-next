import { gql } from "@apollo/client";

export const BLOGS_LIST_QUERY = gql`
  query BlogsList(
    $take: Int
    $skip: Int
    $search: String
    $orderBy: [BlogOrderByInput!]
  ) {
    blogs(take: $take, skip: $skip, search: $search, orderBy: $orderBy) {
      blogCount
      deletedBlogCount
      blogs {
        id
        blogNo
        title
        author
        description
        image
        category
        createdAt
      }
    }
  }
`;

export const DELETED_BLOGS_QUERY = gql`
  query DeletedBlogs(
    $take: Int
    $skip: Int
    $search: String
    $orderBy: [BlogOrderByInput!]
  ) {
    deletedBlogs(take: $take, skip: $skip, search: $search, orderBy: $orderBy) {
      deletedBlogCount
      blogs {
        id
        blogNo
        title
        author
        description
        image
        createdAt
        updatedAt
        createdBy {
          id
        }
      }
    }
  }
`;

export const SINGLE_BLOG_QUERY = gql`
  query SingleBlog($where: BlogWhereUniqueInput!) {
    blog(where: $where) {
      id
      author
      description
      title
      category
      createdAt
      updatedAt
      createdById
      image
      createdBy {
        firstName
      }
    }
  }
`;

export const CREATE_BLOG_MUTATION = gql`
  mutation CreateBlog($createBlogInput: CreateBlogInput!) {
    createBlog(createBlogInput: $createBlogInput) {
      id
    }
  }
`;

export const UPDATE_BLOG_MUTATION = gql`
  mutation UpdateBlog(
    $where: BlogWhereUniqueInput!
    $updateBlogInput: UpdateBlogInput!
  ) {
    updateBlog(where: $where, updateBlogInput: $updateBlogInput) {
      id
    }
  }
`;

export const DELETE_BLOG_MUTATION = gql`
  mutation DeleteBlog($where: BlogWhereUniqueInput!) {
    deleteblog(where: $where) {
      id
    }
  }
`;

export const RESTORE_BLOG_MUTATION = gql`
  mutation RestoreBlog($where: BlogWhereUniqueInput!) {
    restoreBlog(where: $where) {
      id
    }
  }
`;
