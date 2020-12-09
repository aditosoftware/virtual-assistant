ESCAPED_URL=$(printf '%s\n' "$URL" | sed -e 's/[\/&]/\\&/g')
# Now you can use ESCAPED_REPLACE in the original sed statement
for i in $(find /var/www -type f)
do
sed "s/http:\/\/localhost:5000\/api/$ESCAPED_URL/g" $i -i
done

nginx -g "daemon off;"
