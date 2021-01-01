# Shell Script

## Conditional Statement

### 기본 형태

```shell script
if [ condition ] ; then
  statement
elif [ condition ] ; then
  statement
else
  statement
fi
```

### 숫자 

```shell script
NUMBER=10

if [ $NUMBER -eq 5 ] # 10 == 5, false

if [ $NUMBER -lt 5 ] # 10 < 5, false

if [ $NUMBER -gt 5 ] # 10 > 5, true
```

### 문자열

```shell script
TEXT="jake"

if [ "$TEXT" = "cake" ] # "jake" == "cake", false

if [ "$TEXT" != "cake" ] # "jake" != "cake", true

if [ -z "$TEXT" ] # "jake".isNullOrBlank(), false
```
