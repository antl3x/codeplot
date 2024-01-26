FROM nginx:alpine

# Copy the build output from the previous stage
COPY docs/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
